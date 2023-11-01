import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { CalendarList } from "react-native-calendars";
import React, { useState } from "react";
import CalendarMain from "../components/Calendar/CalendarMain";
import CalendarSixWeeks from "../components/Calendar/CalendarSixWeeks";

function CalendarScreen() {
  return (
    <View>
      <Text>술력</Text>
      {/* 주 별 간격 조정 */}
      {/* <CalendarMain /> */}
      {/* 주 별 간격 미조정 */}
      <CalendarSixWeeks />
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: "black",
    borderWidth: 20,
    borderColor: "red",
  },
});

export default CalendarScreen;
