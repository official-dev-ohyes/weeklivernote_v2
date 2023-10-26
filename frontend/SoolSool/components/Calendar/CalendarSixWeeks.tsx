import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import React, { useState, useEffect } from "react";

function CalendarSixWeeks({}) {
  const { height } = Dimensions.get("window");
  const [selectDay, setSelectDay] = useState("");

  const handleDayPress = (day) => {
    setSelectDay(`${day.year}-${day.month}-${day.day}`);
  };
  if (selectDay) {
    console.log(`누른 날짜는? ${selectDay}일!`);
  }
  console.log(`선택된 날짜가 있나요? ${selectDay === ""}`);
  console.log(`선택된 날짜가 뭐야? ${selectDay}`);
  useEffect(() => {}, [selectDay]);
  return (
    <View>
      {selectDay != "" ? (
        <Calendar
          style={{ height: "100%" }}
          theme={{
            "stylesheet.day.basic": {
              base: {
                height: (height * 0.9) / 10,
              },
            },
          }}
          onDayPress={handleDayPress}
        />
      ) : (
        <Calendar
          style={{ height: "100%" }}
          theme={{
            "stylesheet.day.basic": {
              base: {
                height: (height * 0.9) / 7.8,
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
