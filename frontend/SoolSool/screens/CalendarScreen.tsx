import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { CalendarList } from "react-native-calendars";
import React, { useState } from "react";
import CalendarMain from "../components/Calendar/CalendarMain";
import CalendarSixWeeks from "../components/Calendar/CalendarSixWeeks";

let isSelectDay: boolean = false;
let selectDay: string;
let today = new Date();

function CalendarScreen() {
  return (
    <View>
      <Text>Calendar</Text>
      {/* 주 별 간격 조정
      <CalendarMain /> */}
      <CalendarSixWeeks />
    </View>
  );
}

export default CalendarScreen;
