import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import React, { useState, useEffect } from "react";
import DailySummary from "./DailySummary";
import { fetchMonthRecord } from "../../api/drinkRecordApi";
import axios from "axios";

function CalendarSixWeeks({}) {
  // 진짜 오늘 정보 저장
  const today = new Date();
  const nowDate = `${today.getFullYear()}-${
    today.getMonth() + 1 < 10 ? "0" : ""
  }${today.getMonth() + 1}-${
    today.getDate() < 10 ? "0" : ""
  }${today.getDate()}`;

  const [currentDay, setCurrentDay] = useState("");
  const { height } = Dimensions.get("window");
  const [isSelectDay, setIsSelectDay] = useState<boolean>(false);
  const [selectDay, setSelectDay] = useState("");
  const [alcoholDays, setAlcoholDays] = useState([]);
  const [alcoholInfo, setAlcoholInfo] = useState([]);
  const [isSame, setIsSame] = useState<boolean>(false);

  useEffect(() => {
    console.log(`현재 날짜는? ${nowDate}`);
    const setAndFetch = async () => {
      await setCurrentDay(nowDate);
      fetchMonthRecord(nowDate) // currentDay로 실행시 적용 안됨
        .then((res) => {
          // console.log("성공", res.drinks);
          setAlcoholInfo(res.deinks);

          const drinkData = res.drinks;
          setAlcoholInfo(drinkData);

          let days = [];
          for (let i = 0; i < drinkData.length; i++) {
            days.push(drinkData[i].date);
          }
          setAlcoholDays(days);
          console.log(`알코올 마신 날들은? ${days}`);
        })
        .catch((err) => {
          console.error("실패", err);
        });
    };
    setAndFetch();
  }, [nowDate]);

  const handleDayPress = async (clickDay) => {
    const newMonth =
      clickDay.month < 10 ? `0${clickDay.month}` : clickDay.month;
    const newDay = clickDay.day < 10 ? `0${clickDay.day}` : clickDay.day;
    const newDate = `${clickDay.year}-${newMonth}-${newDay}`;
    // console.log(`변경된 날짜는? ${newDate}`);
    if (newDate === selectDay) {
      setSelectDay("");
      setIsSelectDay(false);
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

  const height1 = (height * 0.9) / 10;
  const height2 = (height * 0.9) / 7.8;

  return (
    <View style={styles.totalContainer}>
      {isSelectDay ? (
        <View>
          <View style={styles.smallCalendar}>
            <Calendar
              current={currentDay}
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
              <Text>내일 새벽 5시에 업데이트 됩니다</Text>
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
    height: "97.5%",
    backgroundColor: "balck",
    borderWidth: 2,
    borderColor: "red",
    flexDirection: "column",
    // justifyContent: "space-between",
  },
  smallCalendar: {
    height: "80%",
    borderWidth: 2,
    borderColor: "orange",
  },
  largeCalendar: {
    height: "100%",
    borderWidth: 2,
    borderColor: "orange",
  },
  dailySummaryComponent: {
    height: "20%",
    backgroundColor: "balck",
  },
});

export default CalendarSixWeeks;

// 페이지 벗어날 때, 선택된 날 없도록 초기화 하기 -> 에뮬레이터 문제인지 확인하기
