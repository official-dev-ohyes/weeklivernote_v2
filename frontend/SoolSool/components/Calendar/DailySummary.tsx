import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

function DailySummary({ summaryText }) {
  // 술 종류가 몇 개인지 알아오는 로직 추가하기
  return (
    <View style={styles.check}>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>{summaryText}</Text>
      </View>
      <View style={styles.informations}>
        <View style={styles.category}>
          <View style={styles.eachAlcohol}>
            {/* 나중에 여기에 각각 술 아이콘이 들어가요 */}
            <View style={styles.eachAlcoholIcon}>
              <Text>아이콘1</Text>
            </View>
            <Text>수량</Text>
          </View>
          <Text>아이콘2</Text>
          <Text>아이콘3</Text>
        </View>
        <View style={styles.textInformations}>
          <Text>총량</Text>
          <Text>최대 알코올 수치</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  check: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    // 글씨 키우기
  },
  headerBox: {
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  headerText: {
    // 높이의 몇 퍼센트로 하고 싶은걸
  },
  informations: {
    height: "80%",
    flexDirection: "row",
    paddingBottom: 20,
  },
  category: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "yellow",
  },
  eachAlcohol: {
    height: "80%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingLeft: 5,
    // paddingRight: 5,
  },
  eachAlcoholIcon: {
    height: "80%",
    justifyContent: "center",
    backgroundColor: "blue",
  },
  textInformations: {
    width: "50%",
    padding: 5,
    flexDirection: "column",
    justifyContent: "space-around",
  },
});

export default DailySummary;
