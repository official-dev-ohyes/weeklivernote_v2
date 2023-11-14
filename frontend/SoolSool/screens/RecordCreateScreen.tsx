import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { Button, TextInput, IconButton } from "react-native-paper";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import NowAddedAlcohols from "../components/Calendar/NowAddedAlcohols";
import { useQuery } from "react-query";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  createDrink,
  fetchDailyDrink,
  fetchDailyDetail,
  removeDrink,
} from "../api/drinkRecordApi";

import { getAmountByDrinkCount } from "../utils/drinkUtils";

function RecordCreateScreen({ route, navigation }) {
  const day = route.params.date;
  // console.log(`지금 고칠 날짜를 확인합시다!!  고치려는 날짜 : ${day}`);
  const isAlcohol = route.params.isAlcohol; // create, update 구분
  const onlyShotDrinks = ["소맥", "하이볼", "칵테일(약)", "칵테일(강)"];
  const [alcoholRecord, setAlcoholRecord] = useState([]);
  const [selectedAlcohol, setSelectedAlcohol] = useState("소주");
  const [value, setValue] = useState(0); // 음주량
  const [selectedUnit, setSelectedUnit] = useState("잔");
  const [selectedAmPm, setSelectedAmPm] = useState("PM");
  const [selectedHour, setSelectedHour] = useState("시");
  const [selectedMinute, setSelectedMinute] = useState("분");
  const [memo, setMemo] = useState("");
  const alcoholCategory = [
    "소주",
    "맥주",
    "소맥",
    "와인",
    "하이볼",
    "막걸리",
    "칵테일(약)",
    "칵테일(강)",
    "위스키",
  ];
  const hour = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const minute = [
    "00",
    "05",
    "10",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "55",
  ];

  // 음주량 수정
  const handleDecrement = () => {
    if (value > 0) {
      const newValue = value - 0.5;
      setValue(newValue);
    }
  };
  const handleIncrement = () => {
    const newValue = value + 0.5;
    setValue(newValue);
  };

  // 주종별 음주 기록 추가
  const handleAdd = () => {
    const newRecord = {
      category: selectedAlcohol,
      drinkUnit: selectedUnit,
      drinkAmount: value,
    };

    const existingRecordIndex = alcoholRecord.findIndex(
      (record) =>
        record.category === selectedAlcohol && record.drinkUnit === selectedUnit
    );

    if (existingRecordIndex >= 0) {
      alcoholRecord[existingRecordIndex].drinkAmount += value;
    } else {
      if (newRecord.drinkAmount > 0) {
        setAlcoholRecord((prevRecords) => [...prevRecords, newRecord]);
      } else {
        Alert.alert("알림", "수량을 조절하세요.");
      }
    }

    setValue(0);
    setSelectedAlcohol("소주");
    setSelectedUnit("잔");
  };

  // 전체 기록 추가
  const saveRecord = async () => {
    if (selectedHour === "시" || selectedMinute === "분") {
      Alert.alert("알림", "음주 시작 시간을 입력해주세요.");
      return;
    }
    if (alcoholRecord.length === 0) {
      Alert.alert("알림", "마신 술 정보를 추가하세요.");
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

        const dailyDrink = await fetchDailyDrink(date);

        if (dailyDrink) {
          // 추후 업데이트 기능으로 자동 연결 구현
          Alert.alert("알림", "어제 날짜에 이미 음주 기록이 있습니다.");
          return;
        }
      }
    } else {
      time = `${parseInt(selectedHour, 10) + 12}:${selectedMinute}`;
    }

    if (isAlcohol) {
      removeDrink(day);
    }
    createDrink({
      drinks: [...alcoholRecord],
      drinkDate: date,
      startTime: time,
      memo: memo,
      hangover: "",
    }).then((res) => {
      navigation.navigate("Calendar");
    });
  };

  // [업데이트] 기존 요약/상세 정보 불러오기
  const {
    data: DailyDrinkData,
    isLoading: dailyLoading,
    isError: dailyError,
  } = useQuery(
    ["DailyDrinkQuery", day],
    async () => await fetchDailyDrink(day)
  );
  // console.log(`요약조회 ${JSON.stringify(DailyDrinkData, null, 2)}`);

  const {
    data: DailyDetailData,
    isLoading: detailLoading,
    isError: detailError,
  } = useQuery(
    ["DailyDetailQuery", day],
    async () => await fetchDailyDetail(day)
  );
  // console.log(`요약조회 ${JSON.stringify(DailyDetailData, null, 2)}`);

  useEffect(() => {
    if (isAlcohol) {
      // 술자리 시작 시간, 메모, 사진 불러오기
      if (DailyDetailData) {
        const tempHour = parseInt(
          DailyDetailData.startTime.substring(11, 13),
          10
        );
        if (tempHour < 12) {
          setSelectedAmPm("AM");
          setSelectedHour(tempHour < 10 ? `0${tempHour}` : `${tempHour}`);
        } else if (tempHour === 12) {
          setSelectedAmPm("PM");
          setSelectedHour("12");
        } else {
          setSelectedAmPm("PM");
          setSelectedHour(
            tempHour - 12 < 10 ? `0${tempHour - 12}` : `${tempHour - 12}`
          );
        }
        setSelectedMinute(
          `${parseInt(
            DailyDetailData.startTime.substring(14, 16),
            10
          ).toString()}`
        );
        if (DailyDetailData.memo) {
          setMemo(DailyDetailData.memo);
        }
      }

      // 주종 별 음주량 불러오기
      if (DailyDrinkData) {
        for (let i = 0; i < DailyDrinkData.drinks.length; i++) {
          const category = DailyDrinkData.drinks[i].drink;
          const drinkCount = DailyDrinkData.drinks[i].count;
          const result = getAmountByDrinkCount(category, drinkCount);
          // console.log(result);

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
              setAlcoholRecord((prevRecords) => [
                ...prevRecords,
                newShotRecord,
              ]);
            }
          }
        }
      }
    }
  }, [isAlcohol, DailyDrinkData, DailyDetailData]);

  const gotoDetailPage = () => {
    console.log("뒤로가기버튼 클릭");
    navigation.navigate("DailyDetail", {
      summaryText: day,
      alcoholDays: [],
      isAlcohol: isAlcohol,
    });
  };

  // 주종별 음주 기록 삭제
  const handleDeleteRecord = (index) => {
    const updatedRecords = [...alcoholRecord];
    updatedRecords.splice(index, 1);
    setAlcoholRecord(updatedRecords);
  };

  return (
    <View style={styles.total}>
      <ScrollView style={styles.scrollBox}>
        <View style={styles.mainTextBox}>
          <Text style={styles.headerText}>{day}</Text>
          <View style={styles.light}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={30}
              color="black"
              onPress={() => {
                Alert.alert(
                  "알림",
                  "05시 이전의 기록은 어제 날짜에 추가됩니다."
                );
              }}
            />
          </View>
        </View>
        <View style={styles.contents}>
          <View style={styles.tagArea}>
            {alcoholRecord.length > 0 ? (
              <View style={styles.tag}>
                <NowAddedAlcohols
                  alcoholRecord={alcoholRecord}
                  onDeleteRecord={handleDeleteRecord}
                />
              </View>
            ) : null}
          </View>
          <View style={styles.alcoholArea}>
            <View style={styles.alcoholInput}>
              <Text style={styles.word}>술</Text>
              <View style={styles.category}>
                <View style={styles.alcoholInput}>
                  <View style={styles.category}>
                    <Picker
                      mode="dropdown"
                      selectedValue={selectedAlcohol}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedAlcohol(itemValue)
                      }
                    >
                      {alcoholCategory.map((category, index) => (
                        <Picker.Item
                          key={index}
                          label={category}
                          value={category}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.alcoholInput}>
              <Text style={styles.word}>양</Text>
              <View style={styles.alcoholAmount}>
                <IconButton icon="minus" onPress={handleDecrement} size={15} />
                <Text>{value}</Text>
                <IconButton icon="plus" onPress={handleIncrement} size={15} />
              </View>
              <View style={styles.alcoholUnit}>
                <Picker
                  mode="dropdown"
                  selectedValue={selectedUnit}
                  onValueChange={(itemValue, itemIndex) => {
                    if (onlyShotDrinks.includes(selectedAlcohol)) {
                      setSelectedUnit("잔");
                    } else {
                      setSelectedUnit(itemValue);
                    }
                  }}
                >
                  <Picker.Item label="잔" value="잔" />
                  {!onlyShotDrinks.includes(selectedAlcohol) && (
                    <Picker.Item label="병" value="병" />
                  )}
                </Picker>
              </View>
            </View>
            <View style={styles.buttons}>
              <Button
                style={styles.button}
                // buttonColor={"#363C4B"}
                mode="outlined"
                onPress={() => {
                  setAlcoholRecord([]);
                  setValue(0);
                }}
              >
                초기화
              </Button>
              <Button
                style={styles.button}
                mode="contained"
                // onPress={() => {
                //   const newRecord = {
                //     category: selectedAlcohol,
                //     drinkUnit: selectedUnit,
                //     drinkAmount: value,
                //   };
                //   const existingRecordIndex = alcoholRecord.findIndex(
                //     (record) => {
                //       return (
                //         record.category === selectedAlcohol &&
                //         record.drinkUnit === selectedUnit
                //       );
                //     }
                //   );

                //   if (existingRecordIndex >= 0) {
                //     alcoholRecord[existingRecordIndex].drinkAmount += value;
                //   } else {
                //     if (newRecord.drinkAmount > 0) {
                //       setAlcoholRecord((prevRecords) => [
                //         ...prevRecords,
                //         newRecord,
                //       ]);
                //     } else {
                //       Alert.alert("알림", "수량을 조절하세요.");
                //     }
                //   }
                //   setValue(0);
                //   setSelectedAlcohol("소주");
                //   setSelectedUnit("잔");
                //   console.log(alcoholRecord);
                // }}
                onPress={handleAdd}
                buttonColor={"#363C4B"}
              >
                추가
              </Button>
            </View>
          </View>
          <View style={styles.time}>
            <Text style={styles.texts}>술자리 시작 시간</Text>
            <View style={styles.timer}>
              <Picker
                mode="dropdown"
                selectedValue={selectedAmPm}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedAmPm(itemValue)
                }
                style={{ width: "31%" }}
              >
                <Picker.Item label="AM" value="AM" />
                <Picker.Item label="PM" value="PM" />
              </Picker>
              <Picker
                mode="dropdown"
                selectedValue={selectedHour}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedHour(itemValue)
                }
                style={{ width: "29%" }}
              >
                <Picker.Item label={selectedHour} value="" />
                {hour.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
              <Picker
                mode="dropdown"
                selectedValue={selectedMinute}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedMinute(itemValue)
                }
                style={{ width: "29%" }}
              >
                <Picker.Item label={selectedMinute} value="" />
                {minute.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.memo}>
            {/* <View>
            <Text>사진 입력 자리</Text>
          </View> */}
            <Text style={styles.texts}>오늘의 기록</Text>
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
              mode="outlined"
              onPress={gotoDetailPage}
            >
              돌아가기
            </Button>
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
  },
  scrollBox: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F7F9FF",
  },
  mainTextBox: {
    flex: 1,
    // height: "13%",
    padding: "5%",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
  },
  headerText: {
    fontSize: 40,
    verticalAlign: "bottom",
    fontFamily: "LineRegular",
  },
  light: {
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "2%",
  },
  contents: {
    display: "flex",
    height: 700,
    flexDirection: "column",
    // alignContent: "space-between",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    margin: "3%",
    borderRadius: 5,
    backgroundColor: "#ffffff",
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
  tagArea: {
    height: "auto",
    marginVertical: 10,
  },
  tag: {
    height: 70,
  },
  alcoholArea: {
    height: "30%",
    borderRadius: 5,
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  alcoholInput: {
    height: "25%",
    margin: "1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
  },
  word: {
    flex: 0.5,
    fontWeight: "bold",
    fontSize: 16,
  },
  category: {
    flex: 2,
    height: "90%",
    // margin: "1%",
    justifyContent: "center",
    // backgroundColor: "blue",
  },
  alcoholAmount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "90%",
  },
  alcoholUnit: {
    flex: 1,
    height: "90%",
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: "3%",
  },
  button: {
    flex: 2,
    // margin: "1%",
    marginBottom: 10,
  },
  time: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "10%",
    marginTop: "1%",
  },
  timer: {
    height: "60%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
  },
  timeInput: {
    flexDirection: "row",
  },
  memo: {
    marginTop: "1%",
    marginBottom: "1%",
    // backgroundColor: "red",
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
  },
});

export default RecordCreateScreen;
