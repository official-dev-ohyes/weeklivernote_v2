import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import BodyDetail from "./BodyDetail";
import { Icon, MD3Colors } from "react-native-paper";

// interface BodyInfoProps {
// nonAlc:number;
// }

function BodyInfo({ navigation }) {
  const [selectedGender, setSelectedGender] = useState(""); // 초기값은 빈 문자열로 설정
  const handleGenderSelection = (gender) => {
    if (selectedGender === gender) {
      // 이미 선택된 버튼을 다시 누를 경우 선택 해제
      setSelectedGender("");
    } else {
      // 다른 버튼을 선택한 경우 선택 상태로 변경
      setSelectedGender(gender);
    }
  };

  // 스타일을 선택된 버튼에 따라 동적으로 적용
  const getButtonStyle = (gender) => {
    if (selectedGender === gender) {
      return [styles.button, styles.selectedButton];
    }
    return styles.button;
  };

  const getButtonTextStyle = (gender) => {
    if (selectedGender === gender) {
      return [styles.buttonText, styles.selectedButtonText];
    }
    return styles.buttonText;
  };

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
          <TouchableOpacity
            style={getButtonStyle("남자")}
            onPress={() => handleGenderSelection("남자")}
          >
            <Text style={getButtonTextStyle("남자")}>남자</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getButtonStyle("여자")}
            onPress={() => handleGenderSelection("여자")}
          >
            <Text style={getButtonTextStyle("여자")}>여자</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BodyDetail navigation={navigation} gender={selectedGender} />
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
  // 선택된 버튼 스타일
  selectedButton: {
    backgroundColor: "#384BAD", // 선택 시 배경색 변경
  },
  selectedButtonText: {
    color: "#FFFFFF", // 선택 시 텍스트색 변경
  },
});

export default BodyInfo;
