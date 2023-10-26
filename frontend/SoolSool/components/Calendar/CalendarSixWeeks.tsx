import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import React, { useState, useEffect } from "react";
import DailySummary from "./DailySummary";

function CalendarSixWeeks({}) {
  const { height } = Dimensions.get("window");
  const [isSelectDay, setIsSelectDay] = useState<boolean>(false);
  const [selectDay, setSelectDay] = useState("");

  const handleDayPress = (day) => {
    if (`${day.year}-${day.month}-${day.day}` === selectDay) {
      setSelectDay("");
      setIsSelectDay(false);
    } else {
      setSelectDay(`${day.year}-${day.month}-${day.day}`);
      setIsSelectDay(true);
    }
  };

  if (selectDay) {
    console.log(`선택된 날은? = ${selectDay}일!`);
  }
  console.log(`선택된 날 없다! ${selectDay === ""}`);

  const height1 = (height * 0.9) / 10;
  const height2 = (height * 0.9) / 7.8;

  return (
    <View style={styles.totalContainer}>
      {isSelectDay ? (
        <View>
          <View style={styles.smallCalendar}>
            <Calendar
              // style={{ height: "100%" }}
              theme={{
                "stylesheet.day.basic": {
                  base: {
                    height: height1,
                  },
                },
              }}
              onDayPress={handleDayPress}
            />
          </View>
          <View style={styles.dailySummaryComponent}>
            <DailySummary summaryText={`Selected day: ${selectDay}`} />
          </View>
        </View>
      ) : (
        <View style={styles.largeCalendar}>
          <Calendar
            // style={{ height: "100%" }}
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
    height: "77.5%",
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

// 페이지 벗어날 때, 선택된 날 없도록 초기화 하기
