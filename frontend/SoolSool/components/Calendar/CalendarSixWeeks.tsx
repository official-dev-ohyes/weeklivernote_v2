import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import React, { useState, useEffect } from "react";

function CalendarSixWeeks({}) {
  const { height } = Dimensions.get("window");
  const [selectDay, setSelectDay] = useState("");
  const [nowHeight, setNowHeight] = useState((height * 0.9) / 7.8);

  const handleDayPress = (day) => {
    setSelectDay(`${day.year}-${day.month}-${day.day}`);
    setNowHeight((height * 0.9) / 10);
  };

  if (selectDay) {
    console.log(`The selected day is = ${selectDay}!`);
  }
  console.log(`Isn't selectDay empty? ${selectDay === ""}`);
  console.log(`지금 높이는? ${nowHeight}`);

  const height1 = (height * 0.9) / 10;
  const height2 = (height * 0.9) / 7.8;

  return (
    <View>
      <Text>{selectDay}</Text>
      <Text>{nowHeight}</Text>
      {selectDay.length ? (
        <>
          <Calendar
            style={{ height: "100%" }}
            theme={{
              "stylesheet.day.basic": {
                base: {
                  height: height1,
                },
              },
            }}
            onDayPress={handleDayPress}
          />
        </>
      ) : (
        <Calendar
          style={{ height: "100%" }}
          theme={{
            "stylesheet.day.basic": {
              base: {
                height: height2,
              },
            },
          }}
          onDayPress={handleDayPress}
        />
      )}
    </View>
  );
}

export default CalendarSixWeeks;
