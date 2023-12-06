import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Button, TextInput, IconButton, MD3Colors } from "react-native-paper";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  createDrink,
  updateDrink,
  fetchDailyDrink,
  fetchDailyDetail,
  postImage,
} from "../api/drinkRecordApi";

import { getAmountByDrinkCount } from "../utils/drinkUtils";
import CalendarImagePicker from "../components/Calendar/CalendarImagePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AlcoholInput from "../components/Calendar/AlcoholInput";
import TimeInput from "../components/Calendar/TimeInput";

function RecordCreateScreen({ route, navigation }) {
  const queryClient = useQueryClient();
  const [image, setImage] = useState<string | null>(null);
  const [token, setToken] = useState(null);
  const day = route.params.date;
  const isAlcohol = route.params.isAlcohol; // create, update 구분
  const [alcoholRecord, setAlcoholRecord] = useState([]);
  const [selectedAlcohol, setSelectedAlcohol] = useState("소주");
  const [value, setValue] = useState(0); // 음주량
  const [selectedUnit, setSelectedUnit] = useState("잔");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  interface DrinkData {
    drinks: Array<Record<string, unknown>>;
    drinkDate: string;
    startTime: string;
    memo: string;
    hangover: string;
  }

  // 시간 관련
  const currentDate = new Date();
  let currentHour = currentDate.getHours();
  let currentMinute = currentDate.getMinutes();

  const [selectedAmPm, setSelectedAmPm] = useState("PM");
  const [selectedHour, setSelectedHour] = useState(
    currentHour < 10 ? `0${currentHour}` : `${currentHour}`
  );
  const [selectedMinute, setSelectedMinute] = useState(
    currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`
  );

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tempToken = await AsyncStorage.getItem("accessToken");
        setToken(tempToken);
      } catch (err) {
        console.error("token을 꺼내오다 에러 발생", err);
      }
    };
    fetchToken();
    // 초기 시간 설정
    if (currentHour >= 12) {
      setSelectedAmPm("PM");
      currentHour -= 12;
    } else {
      setSelectedAmPm("AM");
    }
    setSelectedHour(currentHour < 10 ? `0${currentHour}` : `${currentHour}`);
    setSelectedMinute(
      currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`
    );
  }, [token]);
  // 시간 선택 라이브러리
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    if (hours >= 12) {
      setSelectedAmPm("PM");
      if (hours > 12) hours -= 12;
    } else {
      setSelectedAmPm("AM");
    }

    setSelectedHour(hours < 10 ? `0${hours}` : `${hours}`);
    setSelectedMinute(minutes < 10 ? `0${minutes}` : `${minutes}`);
  };

  const showMode = () => {
    setShow(true);
  };

  const saveMutation = useMutation<void, unknown, DrinkData, unknown>(
    async (data) => {
      await createDrink(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("DailyDrinkQuery");
      },
    }
  );

  // 전체 기록 추가
  const saveRecord = async () => {
    console.log("저장버튼을 클릭");
    if (selectedHour === "시" || selectedMinute === "분") {
      Alert.alert("알림", "음주 시작 시간을 입력해주세요.");
      return;
    }
    if (alcoholRecord.length === 0) {
      Alert.alert("알림", "마신 술 정보를 추가하세요.");
      return;
    }

    let date = day;
    let time;
    if (selectedAmPm === "AM") {
      time = `${selectedHour}:${selectedMinute}`;
      if (selectedHour < "05") {
        const currentDate = new Date(day);
        currentDate.setDate(currentDate.getDate() - 1);
        date = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

        try {
          const dailyDrink = await fetchDailyDrink(date);

          if (dailyDrink) {
            // 추후 업데이트 기능으로 자동 연결 구현
            Alert.alert("알림", "어제 날짜에 이미 음주 기록이 있습니다.");
            return;
          }
        } catch (error) {
          Alert.alert("알림", "새벽 5시 이전 음주는 전일에 기록됩니다.");
          console.error("전날 음주기록이 없으므로 무시하고 진행", error);
        }
      }
    } else {
      time = `${parseInt(selectedHour, 10) + 12}:${selectedMinute}`;
    }

    if (isAlcohol) {
      await updateDrink({
        drinks: [...alcoholRecord],
        drinkDate: date,
        startTime: time,
        memo: memo,
        hangover: "",
      })
        .then((res) => {
          console.log("업데이트 성공");
        })
        .catch((err) => {
          console.log("업데이트 실패");
        });
    } else {
      await createDrink({
        drinks: [...alcoholRecord],
        drinkDate: date,
        startTime: time,
        memo: memo,
        hangover: "",
      })
        .then(async (res) => {
          console.log("작성 성공");
          await postImage(image, token, day)
            .then((res) => {
              console.log("이미지도 저장 성공");
            })
            .catch(() => {
              console.log("이미지는 저장 실패");
            });
        })
        .catch((err) => {
          console.log("작성 실패");
        });
    }

    navigation.navigate("Calendar", { date: date, refresh: true });
  };

  // [업데이트] 기존 요약/상세 정보 불러오기
  const {
    data: DailyDrinkData,
    isLoading: dailyLoading,
    isError: dailyError,
  } = useQuery(
    ["DailyDrinkQuery", day],
    async () => await fetchDailyDrink(day),
    {
      enabled: isAlcohol,
    }
  );
  // console.log(`요약조회 ${JSON.stringify(DailyDrinkData, null, 2)}`);

  const {
    data: DailyDetailData,
    isLoading: detailLoading,
    isError: detailError,
  } = useQuery(
    ["DailyDetailQuery", day],
    async () => await fetchDailyDetail(day),
    {
      enabled: isAlcohol,
    }
  );
  // console.log(`요약조회 ${JSON.stringify(DailyDetailData, null, 2)}`);

  useEffect(() => {
    if (isAlcohol && DailyDetailData) {
      // 시간 불러오기
      const startTime = DailyDetailData.startTime;
      let hour = parseInt(startTime.substring(11, 13), 10);
      let minute = startTime.substring(14, 16);

      if (hour >= 12) {
        setSelectedAmPm("PM");
        if (hour > 12) hour -= 12;
      } else {
        setSelectedAmPm("AM");
      }
      setSelectedHour(hour < 10 ? `0${hour}` : `${hour}`);
      setSelectedMinute(minute);
    } else {
      if (currentHour >= 12) {
        setSelectedAmPm("PM");
        currentHour -= 12;
      } else {
        setSelectedAmPm("AM");
      }
      setSelectedHour(currentHour < 10 ? `0${currentHour}` : `${currentHour}`);
      setSelectedMinute(
        currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`
      );
    }

    // 주종 별 음주량 불러오기
    if (DailyDrinkData && Array.isArray(DailyDrinkData.drinks)) {
      for (let i = 0; i < DailyDrinkData.drinks.length; i++) {
        const category = DailyDrinkData.drinks[i].drink;
        const drinkCount = DailyDrinkData.drinks[i].count;
        const result = getAmountByDrinkCount(category, drinkCount);

        const newBottleRecord = {
          category: category,
          drinkUnit: "병",
          drinkAmount: result[0],
        };
        const newShotRecord = {
          category: category,
          drinkUnit: "잔",
          drinkAmount: result[1],
        };
        const existingRecordIndex = alcoholRecord.findIndex((record) => {
          return (
            record.category === selectedAlcohol &&
            record.drinkUnit === selectedUnit
          );
        });

        if (existingRecordIndex >= 0) {
          alcoholRecord[existingRecordIndex].drinkAmount += value;
          return;
        } else {
          if (newBottleRecord.drinkAmount) {
            setAlcoholRecord((prevRecords) => [
              ...prevRecords,
              newBottleRecord,
              newShotRecord,
            ]);
          } else {
            setAlcoholRecord((prevRecords) => [...prevRecords, newShotRecord]);
          }
        }
      }
    }
  }, [isAlcohol, DailyDrinkData, DailyDetailData]);

  const goToDetailPage = () => {
    navigation.navigate("Calendar");
  };

  return (
    <View style={styles.total}>
      <View style={styles.mainTextBox}>
        <Text style={styles.headerText}>{day}</Text>
        <IconButton
          icon="help-circle-outline"
          iconColor={MD3Colors.neutral70}
          size={20}
          onPress={() => {
            Alert.alert("알림", "05시 이전의 기록은 어제 날짜에 추가됩니다.");
          }}
          style={{ marginLeft: "-2%" }}
        />
      </View>
      <ScrollView style={styles.scrollBox}>
        <View style={styles.contents}>
          <View style={styles.alcohol}>
            <AlcoholInput
              alcoholRecord={alcoholRecord}
              setAlcoholRecord={setAlcoholRecord}
            />
          </View>
          <View style={styles.time}>
            <Text style={styles.timeText}>술자리 시작</Text>
            <TimeInput
              selectedHour={selectedHour}
              selectedMinute={selectedMinute}
              selectedAmPm={selectedAmPm}
              show={show}
              setShow={setShow}
              date={date}
              onChange={onChange}
            />
          </View>

          <View style={styles.memo}>
            <Text style={styles.texts}>메모</Text>
            <CalendarImagePicker image={image} setImage={setImage} />
            <TextInput
              label="술자리 기록을 남겨보세요"
              keyboardType="default"
              mode="outlined"
              value={memo}
              onChangeText={(memo) => setMemo(memo)}
              multiline={true}
              numberOfLines={5}
              outlineColor="#363C4B"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                saveRecord();
              }}
              buttonColor={"#363C4B"}
            >
              {isAlcohol ? "수정" : "저장"}
            </Button>
            <Button
              style={styles.button}
              mode="outlined"
              textColor={"#363C4B"}
              onPress={goToDetailPage}
            >
              돌아가기
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
    height: "100%",
    // flexDirection: "column",
  },
  mainTextBox: {
    paddingHorizontal: "5%",
    marginTop: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "LineRegular",
  },
  scrollBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    // backgroundColor: "#F7F9FF",
  },
  contents: {
    display: "flex",
    height: 750,
    // height: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    margin: "3%",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    // backgroundColor: "blue",
    // 그림자 추가 (Android 및 iOS 모두에서 동작)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // 안드로이드에서 그림자 효과 추가
  },
  alcohol: {
    height: "30%",
  },
  button: {
    flex: 2,
    margin: "1%",
  },
  time: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "5%",
    marginTop: "15%",
  },
  timeText: {
    alignSelf: "center",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
  },
  photo: {
    marginTop: "1%",
    marginBottom: "2%",
  },
  memo: {
    marginTop: "1%",
    marginBottom: "1%",
  },
  texts: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  record: {
    backgroundColor: "#F6F6F6",
    marginVertical: 5,
    padding: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    height: 100,
    gap: 0,
    marginBottom: "5%",
  },
});

export default RecordCreateScreen;
