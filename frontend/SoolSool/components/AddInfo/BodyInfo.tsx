import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import BodyDetail from "./BodyDetail";
import { Icon, MD3Colors } from "react-native-paper";

// interface BodyInfoProps {
// nonAlc:number;
// }

function BodyInfo({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      <View>
        <Text>신체정보를 기준으로 알코올 농도를 계산합니다.</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>신체정보</Text>
        <Icon
          source="lightbulb-on-outline"
          color={MD3Colors.error10}
          size={40}
        />
      </View>
      <View style={styles.columnContainer}>
        <Text style={styles.text}>성별 </Text>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>남자</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>여자</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BodyDetail navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: "#FFFF",
    flexDirection: "column",
    gap: 25,
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: "row",
    width: "100%",
    // justifyContent: "space-evenly",
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  columnContainer: {
    flexDirection: "column",
    gap: 20,
  },
  button: {
    backgroundColor: "#0477BF",
    borderRadius: 10,
    width: "45%",
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
  },
  buttonText: {
    color: "white", // 텍스트 색상을 흰색으로 변경
    fontSize: 20, // 텍스트 크기 설정 (선택 사항)
  },
  text: {
    fontSize: 20,
  },
});

export default BodyInfo;
