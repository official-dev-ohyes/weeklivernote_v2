import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";
import ModalDropdown from "react-native-modal-dropdown";
import NowAddedAlcohols from "../components/Calendar/NowAddedAlcohols";
import { useQuery } from "react-query";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  createDrink,
  fetchDailyDrink,
  fetchDailyDetail,
} from "../api/drinkRecordApi";

function RecordCreateScreen({ route, navigation }) {
  const day = route.params.date;
  const isAlcohol = route.params.isAlcohol; // create, update 구분
  const [DailyDrinkData, setDailyDrinkData] = useState([]);
  // const [DailyDrinkData, setDailyDrinkData] = useState([]);

  const [alcoholRecord, setAlcoholRecord] = useState([]);
  const [selectedAlcohol, setSelectedAlcohol] = useState("");
  const [value, setValue] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedAmPm, setSelectedAmPm] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
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

  const saveRecord = () => {
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
      }
    } else {
      time = `${parseInt(selectedHour, 10) + 12}:${selectedMinute}`;
    }
    console.log("drinks:", JSON.stringify(alcoholRecord, null, 2));
    console.log(`drinkDate : ${date}`);
    console.log(`drinkTime : ${time}`);
    console.log(`memo : ${memo}`);
    createDrink({
      drinks: [...alcoholRecord],
      drinkDate: date,
      startTime: time,
      memo: memo,
      hangover: "",
    }).then((res) => {
      navigation.navigate("Calendar");
      console.log("찐성공");
    });
  };

  // if (isAlcohol) {
  //   const {
  //     data: DailyDrinkData,
  //     isLoading: dailyLoading,
  //     isError: dailyError,
  //   } = useQuery("DailyDrinkQuery", async () => await fetchDailyDrink(day));
  //   console.log(`요약조회 ${JSON.stringify(DailyDrinkData, null, 2)}`);

  //   const {
  //     data: DailyDetailData,
  //     isLoading: detailLoading,
  //     isError: detailError,
  //   } = useQuery("DailyDetailQuery", async () => await fetchDailyDetail(day));
  //   console.log(`상세조회 ${JSON.stringify(DailyDetailData, null, 2)}`);
  //   // setMemo(DailyDetailData.memo);
  //   console.log(`시간은 이렇게 생겼습니다. ${DailyDetailData.startTime}`);
  //   const tempHour = parseInt(DailyDetailData.startTime.substring(11, 13), 10);
  //   console.log(tempHour);
  //   console.log(
  //     `분 정보 : ${parseInt(DailyDetailData.startTime.substring(14, 16), 10)}`
  //   );
  //   // setSelectedHour(
  //   //   tempHour - 12 < 10 ? `0${tempHour - 12}` : `${tempHour - 12}`
  //   // );
  // }

  // useEffect(() => {
  //   setDailyDrinkData(DailyDrinkData)
  //   if (isAlcohol) {
  //     setMemo(DailyDetailData.memo);
  //     setSelectedHour(
  //       tempHour - 12 < 10 ? `0${tempHour - 12}` : `${tempHour - 12}`
  //     );
  //   }
  // }, [isAlcohol, DailyDrinkData]);

  return (
    <View style={styles.total}>
      <View style={styles.mainTextBox}>
        <Text style={styles.headerText}>{day}</Text>
        <View style={styles.light}>
          {/* 아래 클릭 시 새벽 5시 기준 초기화 정보 띄워주기 */}
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={30}
            color="black"
          />
        </View>
      </View>
      <View style={styles.contents}>
        <View style={styles.tagArea}>
          <NowAddedAlcohols alcoholRecord={alcoholRecord} />
        </View>
        <View style={styles.alcoholArea}>
          <View style={styles.alcoholInput}>
            <Text style={styles.word}>술</Text>
            <View style={styles.category}>
              <ModalDropdown
                defaultValue={"주종 선택"}
                defaultValueStyle={styles.buttonInnerText} // @@@@@@@@@@@@@왜 안먹지@@@@@@@@@@@@@
                // defaultValue={selectedAlcohol || "주종 선택"}
                options={alcoholCategory}
                onSelect={(index, value) => setSelectedAlcohol(value)}
                dropdownStyle={{ width: "60%" }}
                renderButtonText={(text) => {
                  return <Text style={styles.buttonInnerText}>{text}</Text>;
                }}
                renderRow={(option) => {
                  return <Text style={styles.dropDownText}>{option}</Text>;
                }}
              />
            </View>
          </View>
          <View style={styles.alcoholInput}>
            <Text style={styles.word}>양</Text>
            <View style={styles.alcoholAmount}>
              <Button mode="contained" onPress={handleDecrement}>
                -
              </Button>
              <Text>{value}</Text>
              <Button mode="contained" onPress={handleIncrement}>
                +
              </Button>
            </View>
            <View style={styles.alcoholUnit}>
              <ModalDropdown
                defaultValue="단위 선택"
                options={["잔", "병"]}
                onSelect={(index, value) => setSelectedUnit(value)}
                dropdownStyle={{ width: "11%", height: "5%" }}
                renderRow={(option) => {
                  return <Text style={styles.dropDownText}>{option}</Text>;
                }}
              />
            </View>
          </View>
          <View style={styles.buttons}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                setAlcoholRecord([]);
                setValue(0);
              }}
              labelStyle={styles.buttonInnerText}
            >
              초기화
            </Button>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                const newRecord = {
                  category: selectedAlcohol,
                  drinkUnit: selectedUnit,
                  drinkAmount: value,
                };
                setAlcoholRecord((prevRecords) => [...prevRecords, newRecord]);
                setValue(0);
                // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@여기다시 디폴트값으로 돌리고 싶다@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                // setSelectedAlcohol("");
                // setSelectedUnit("");
                console.log(alcoholRecord);
              }}
              labelStyle={styles.buttonInnerText}
            >
              추가
            </Button>
          </View>
        </View>
        <View style={styles.time}>
          <Text style={styles.texts}>술자리 시작</Text>
          <View style={styles.timer}>
            <ModalDropdown
              defaultValue="선택"
              options={["AM", "PM"]}
              onSelect={(index, value) => setSelectedAmPm(value)}
              // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@클릭 시 색깔도 이상함@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
              dropdownStyle={{ width: "11%" }} // @@@@@@@@@@@@@@@@@@@@높이가 안넣어져요@@@@@@@@@@@@@@@@@@@@
              renderRow={(option) => {
                return <Text style={styles.dropDownText}>{option}</Text>;
              }}
            />
            <ModalDropdown
              defaultValue="시"
              options={hour}
              onSelect={(index, value) => setSelectedHour(value)}
              dropdownStyle={{ width: "11%" }} // @@@@@@@@@@@@@@@@@@@@높이가 안넣어져요@@@@@@@@@@@@@@@@@@@@
              renderRow={(option) => {
                return <Text style={styles.dropDownText}>{option}</Text>;
              }}
            />
            <Text>:</Text>
            <ModalDropdown
              defaultValue="분"
              options={minute}
              onSelect={(index, value) => setSelectedMinute(value)}
              dropdownStyle={{ width: "11%" }} // @@@@@@@@@@@@@@@@@@@@높이가 안넣어져요@@@@@@@@@@@@@@@@@@@@
              renderRow={(option) => {
                return <Text style={styles.dropDownText}>{option}</Text>;
              }}
            />
          </View>
        </View>
        <View style={styles.memo}>
          {/* <View>
            <Text>사진 입력 자리</Text>
          </View> */}
          <Text style={styles.texts}>Memo</Text>
          {/* 한글 입력이 안돼요ㅠㅠ */}
          <TextInput
            // label="술자리 기록을 남겨보세요"
            keyboardType="default"
            mode="outlined"
            value={memo}
            onChangeText={(memo) => setMemo(memo)}
            multiline={true}
            numberOfLines={9}
            contentStyle={styles.buttonInnerText}
          />
        </View>
        <Button
          mode="contained"
          onPress={() => {
            saveRecord();
          }}
          labelStyle={styles.buttonInnerText}
        >
          저장
        </Button>
        {/* {isAlcohol ? (
          <Button
            mode="contained"
            onPress={() => {
              saveRecord();
            }}
          >
            수정
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={() => {
              saveRecord();
            }}
          >
            저장
          </Button>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
    // backgroundColor: "black",
  },
  mainBackground: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  mainTextBox: {
    height: "10%",
    padding: "5%",
    flexDirection: "row",
    alignItems: "flex-end",
    // backgroundColor: "pink",
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Yeongdeok-Sea",
    verticalAlign: "bottom",
  },
  light: {
    height: "80%",
    // backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "2%",
  },
  contents: {
    height: "87%",
    backgroundColor: "lightgray",
    padding: 10,
    justifyContent: "space-around",
    margin: "3%",
    borderRadius: 15,
  },
  tagArea: {
    height: "10%",
    // backgroundColor: "white",
  },
  alcoholArea: {
    height: "25%",
    backgroundColor: "white",
    borderRadius: 5,
    // 수직방향 정렬 맞추기
  },
  alcoholInput: {
    height: "32%",
    margin: "1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "skyblue",
  },
  word: {
    flex: 1,
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
  },
  category: {
    flex: 2.7,
    height: "90%",
    margin: "1%",
    justifyContent: "center",
    // backgroundColor: "yellow",
  },
  // @@@@@@@@@@@@@@@@@@@@@나중에 세밀하게 수정하기@@@@@@@@@@@@@@@@@@@@@
  alcoholAmount: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "90%",
    marginTop: "1%",
    marginBottom: "1%",
    marginRight: "0.5%",
    // backgroundColor: "white",
  },
  alcoholUnit: {
    flex: 0.5,
    height: "90%",
    padding: "1%",
    margin: "3%",
    // backgroundColor: "pink",
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    margin: "1%",
  },
  time: {
    display: "flex",
    flexDirection: "column",
    // alignContent: ",
    justifyContent: "space-around",
    height: "10%",
    marginTop: "1%",
    // backgroundColor: "white",
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
    justifyContent: "space-between",
  },
  memo: {
    height: "35%",
    marginTop: "1%",
    // backgroundColor: "white",
  },
  texts: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
    marginBottom: "1%",
  },
  record: {
    backgroundColor: "lightgrey",
    marginVertical: 5,
    padding: 10,
  },
  buttonInnerText: {
    fontSize: 17,
    fontFamily: "Yeongdeok-Sea",
  },
  dropDownText: {
    fontSize: 15,
    fontFamily: "Yeongdeok-Sea",
    margin: "2%",
  },
});

export default RecordCreateScreen;
