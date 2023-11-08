import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import BodyDetail from "./BodyDetail";
import { Icon, MD3Colors } from "react-native-paper";

// interface BodyInfoProps {
// nonAlc:number;
// }

function BodyInfo({ navigation, socialId }) {
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
        <Text style={styles.infoText}>
          '주간일기'사용을 위해 정보를 입력해주세요🙂
        </Text>
      </View>

      <View style={styles.titleContainer}>
        <View style={styles.titleSubContainer}>
          <Text style={styles.title}>신체정보</Text>
          <Icon
            source="lightbulb-on-outline"
            color={MD3Colors.error10}
            size={40}
          />
        </View>
        <Text style={styles.mainText}>
          신체정보를 기준으로 알코올 농도를 계산합니다.
        </Text>
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
      <BodyDetail
        navigation={navigation}
        gender={selectedGender}
        socialId={socialId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: "#FFFF",
    flexDirection: "column",
    gap: 20,
    borderRadius: 20,
  },
  titleContainer: {
    flexDirection: "column",
    width: "100%",
    // justifyContent: "space-evenly",
  },
  titleSubContainer: {
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
    gap: 2,
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
    fontSize: 25,
    fontFamily: "Yeongdeok-Sea",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
  },
  selectedButton: {
    backgroundColor: "#384BAD",
  },
  selectedButtonText: {
    color: "#FFFFFF",
  },
  mainText: {
    fontFamily: "Yeongdeok-Sea",
  },
  infoText: {
    fontSize: 16,
    color: "blue",
    fontFamily: "Yeongdeok-Sea",
  },
});

export default BodyInfo;
