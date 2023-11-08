import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import React, { useState } from "react";
import DailySummary from "./DailySummary";
import { fetchMonthRecord } from "../../api/drinkRecordApi";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "react-query";
import { useEvent } from "react-native-reanimated";

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

  const tempDay = currentDay ? currentDay : nowDate;

  const {
    data: MonthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
  } = useQuery("MonthlyQuery", async () => await fetchMonthRecord(tempDay));

  // 네비게이션 이동 시, 재렌더링
  useFocusEffect(
    React.useCallback(() => {
      console.log(`현재 날짜는? ${nowDate}`);
      if (tempDay) {
        setCurrentDay(tempDay);
      }
      if (MonthlyData) {
        const tempDays = {};

        for (let i = 0; i < MonthlyData.drinks.length; i++) {
          const tempDate = MonthlyData.drinks[i].date;
          tempDays[tempDate] = { marked: true };
        }
        setAlcoholDays(tempDays);
      }

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
    }, [nowDate, selectDay, navigator, MonthlyData])
  );

  // 특정일 클릭
  const handleDayPress = async (clickDay) => {
    const newMonth =
      clickDay.month < 10 ? `0${clickDay.month}` : clickDay.month;
    const newDay = clickDay.day < 10 ? `0${clickDay.day}` : clickDay.day;
    const newDate = `${clickDay.year}-${newMonth}-${newDay}`;
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

  // 이전/다음 달 이동 로직
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
    setCurrentDay(shiftDay);
    fetchMonthRecord(shiftDay);
  };

  // 캘린더 칸별 높이 -> 주 수 조절 시 상세 조정 필요
  const height1 = (height * 0.9) / 13.5;
  const height2 = (height * 0.9) / 10;

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
                    내일 새벽 5시에 업데이트 됩니다.
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
                    미래 날짜는 입력이 불가능합니다.
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
    flexDirection: "column",
  },
  smallCalendar: {
    height: "75%",
  },
  largeCalendar: {
    height: "100%",
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
    borderColor: "#363C4B",
    margin: 5,
  },
  headerBox: {
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  others: {
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "5%",
  },
  innerText: {
    fontSize: 17,
  },
  headerText: {
    fontSize: 18,
  },
});

export default CalendarSixWeeks;
