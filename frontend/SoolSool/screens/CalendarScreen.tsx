import { StyleSheet, Text, View, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { CalendarList } from "react-native-calendars";
import React, { useState } from "react";
import CalendarMain from "../components/Calendar/CalendarMain";
import CalendarSixWeeks from "../components/Calendar/CalendarSixWeeks";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function CalendarScreen({ navigation }) {
  return (
    <View style={styles.mainBackground}>
      <View style={styles.mainTextBox}>
        <View style={styles.titleBox}>
          <Text style={styles.headerText}>술력</Text>
          {/* 아래 클릭 시 새벽 5시 기준 초기화 정보 띄워주기 */}
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={30}
            color="white"
            onPress={() => {
              Alert.alert("알림", "05시를 기준으로 하루를 초기화합니다.");
            }}
          />
        </View>
      </View>
      <View style={styles.calendar}>
        {/* 주 별 간격 조정 */}
        {/* <CalendarMain /> */}
        {/* 주 별 간격 미조정 */}
        <CalendarSixWeeks navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#121B33",
    // backgroundColor: "blue",
  },
  mainTextBox: {
    height: "13%",
    padding: "5%",
    // paddingBottom: "-3%",
    flexDirection: "row",
  },
  headerText: {
    fontSize: 40,
    fontFamily: "LineRegular",
    verticalAlign: "bottom",
    color: "white",
  },
  titleBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  calendar: {
    height: "87%",
    // borderWidth: 20,
    // borderColor: "red",
  },
});

export default CalendarScreen;
