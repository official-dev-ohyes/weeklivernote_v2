import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import React, { useState, useEffect } from "react";
import DailySummary from "./DailySummary";
import { fetchMonthRecord } from "../../api/drinkRecordApi";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

function CalendarSixWeeks({}) {
  // 진짜 오늘 정보 저장
  const today = new Date();
  const nowDate = `${today.getFullYear()}-${
    today.getMonth() + 1 < 10 ? "0" : ""
  }${today.getMonth() + 1}-${
    today.getDate() < 10 ? "0" : ""
  }${today.getDate()}`;

  const [currentDay, setCurrentDay] = useState("");
  const [isFuture, setIsFuture] = useState<boolean>(false);
  const { height } = Dimensions.get("window");
  const [isSelectDay, setIsSelectDay] = useState<boolean>(false);
  const [selectDay, setSelectDay] = useState("");
  const [alcoholDays, setAlcoholDays] = useState({});
  const [alcoholInfo, setAlcoholInfo] = useState([]);
  const [isSame, setIsSame] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      console.log(`현재 날짜는? ${nowDate}`);
      const setAndFetch = async () => {
        const tempDay = currentDay ? currentDay : nowDate;
        await setCurrentDay(tempDay);
        fetchMonthRecord(tempDay) // currentDay로 실행시 적용 안됨
          .then((res) => {
            // console.log("성공", res.drinks);
            setAlcoholInfo(res.deinks);

            const drinkData = res.drinks;
            setAlcoholInfo(drinkData);

            const tempDays = {};
            for (let i = 0; i < drinkData.length; i++) {
              const tempDate = drinkData[i].date;
              tempDays[tempDate] = { marked: true };
              // days.push(`${drinkData[i].date}: { selected: true }`);
            }
            setAlcoholDays(tempDays);
            // setAlcoholDays(days);
            // console.log(`알코올 마신 날들은? ${days}`);
          })
          .catch((err) => {
            console.error("실패", err);
          });
      };
      setAndFetch();

      if (selectDay) {
        const checkFuture = () => {
          const selectedTimeStamp = new Date(selectDay).getTime();
          const nowTimestamp = new Date(nowDate).getTime();
          if (nowTimestamp < selectedTimeStamp) {
            setIsFuture(true);
          } else {
            setIsFuture(false);
          }
        };
        checkFuture();
      }
    }, [nowDate, selectDay, navigator])
  );

  const handleDayPress = async (clickDay) => {
    const newMonth =
      clickDay.month < 10 ? `0${clickDay.month}` : clickDay.month;
    const newDay = clickDay.day < 10 ? `0${clickDay.day}` : clickDay.day;
    const newDate = `${clickDay.year}-${newMonth}-${newDay}`;
    // console.log(`변경된 날짜는? ${newDate}`);
    if (newDate === selectDay) {
      setSelectDay("");
      setIsSelectDay(false);
      setIsFuture(false);
    } else {
      setSelectDay(newDate);
      setCurrentDay(newDate);
      await fetchMonthRecord(newDate);
      if (nowDate === newDate) {
        setIsSame(true);
      } else {
        setIsSame(false);
      }
      setIsSelectDay(true);
    }
  };

  const handlePressArrowLeft = async (newMonth) => {
    newMonth();
    shiftMonth("previous");
  };

  const handelPressArrowRight = async (newMonth) => {
    newMonth();
    shiftMonth("next");
  };

  const shiftMonth = (to) => {
    const current = new Date(currentDay);
    let shiftDay;
    if (to === "next") {
      shiftDay = `${current.getFullYear()}-${
        current.getMonth() + 2 < 10 ? "0" : ""
      }${current.getMonth() + 2}-${"01"}`;
    } else {
      shiftDay = `${current.getFullYear()}-${
        current.getMonth() < 10 ? "0" : ""
      }${current.getMonth()}-${"01"}`;
    }
    // console.log(`이동한 날짜는 ${shiftDay}`);
    setCurrentDay(shiftDay);
    fetchMonthRecord(shiftDay);
  };

  const height1 = (height * 0.9) / 13.5;
  const height2 = (height * 0.9) / 10;

  // const selectedDayStyle = {
  //   selected: {
  //     // backgroundColor: 'blue',
  //     borderRadius: 16,
  //   },
  //   today: {
  //     color: 'blue'
  //   },
  // };

  // console.log(
  //   // `alcoholDays는 이렇게 생겼다!! ${JSON.stringify(alcoholDays, null, 2)}`
  // );

  // console.log(`선택한 날짜는 ${selectDay}, 미래인가요? ${isFuture}`);

  return (
    <View style={styles.totalContainer}>
      {isSelectDay ? (
        <View>
          <View style={styles.smallCalendar}>
            <Calendar
              current={currentDay}
              markedDates={alcoholDays}
              // style={{ height: "100%" }}
              theme={{
                "stylesheet.day.basic": {
                  base: {
                    height: height1,
                  },
                },
                "stylesheet.calendar.header": {
                  monthText: {
                    fontFamily: "Yeongdeok-Sea",
                    fontSize: 20,
                  },
                  dayHeader: {
                    fontFamily: "Yeongdeok-Sea",
                    fontSize: 14,
                  },
                },
              }}
              onDayPress={handleDayPress}
              onPressArrowLeft={handlePressArrowLeft}
              onPressArrowRight={handelPressArrowRight}
            />
          </View>
          <View style={styles.dailySummaryComponent}>
            {isSame ? (
              <View style={styles.dailySummaryTotal}>
                <View style={styles.headerBox}>
                  <Text style={styles.headerText}>{selectDay}</Text>
                </View>
                <View style={styles.others}>
                  <Text style={styles.innerText}>
                    내일 새벽 5시에 업데이트 됩니다
                  </Text>
                </View>
              </View>
            ) : isFuture ? (
              <View style={styles.dailySummaryTotal}>
                <View style={styles.headerBox}>
                  <Text style={styles.headerText}>{selectDay}</Text>
                </View>
                <View style={styles.others}>
                  <Text style={styles.innerText}>
                    미래 날짜는 입력이 불가능합니다
                  </Text>
                </View>
              </View>
            ) : (
              <DailySummary
                summaryText={selectDay}
                alcoholDays={alcoholDays}
                // navigation={navigation}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.largeCalendar}>
          <Calendar
            // style={{ height: "100%" }}
            current={currentDay}
            markedDates={alcoholDays}
            theme={{
              "stylesheet.day.basic": {
                base: {
                  alignSelf: "stretch",
                  alignItems: "center",
                  height: height2,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                },
              },
              "stylesheet.calendar.header": {
                monthText: {
                  fontFamily: "Yeongdeok-Sea",
                  fontSize: 20,
                },
                dayHeader: {
                  fontFamily: "Yeongdeok-Sea",
                  fontSize: 14,
                },
              },
            }}
            headerStyle={{}}
            onDayPress={handleDayPress}
            onPressArrowLeft={handlePressArrowLeft}
            onPressArrowRight={handelPressArrowRight}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    height: "100%",
    backgroundColor: "balck",
    flexDirection: "column",
    // borderWidth: 2,
    // borderColor: "red",
    // justifyContent: "space-between",
  },
  smallCalendar: {
    height: "75%",
    // borderWidth: 2,
    // borderColor: "orange",
  },
  largeCalendar: {
    height: "100%",
    // borderWidth: 2,
    // borderColor: "orange",
  },
  dailySummaryComponent: {
    height: "25%",
    backgroundColor: "balck",
  },
  dailySummaryTotal: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    padding: 5,
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 2,
    borderColor: "#0477BF",
    margin: 5,
  },
  headerBox: {
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    // backgroundColor: "black",
  },
  others: {
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "5%",
  },
  innerText: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Yeongdeok-Sea",
  },
});

export default CalendarSixWeeks;

// 페이지 벗어날 때, 선택된 날 없도록 초기화 하기 -> 에뮬레이터 문제인지 확인하기
