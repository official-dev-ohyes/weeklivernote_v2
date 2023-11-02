import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "react-native-paper";
import DotIndicator from "../components/AddInfo/DotIndicator ";
import { saveUserInfo } from "../api/addInfoApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AddInfoStep3Screen({ navigation, route }) {
  const { height, weight, gender, address } = route.params;

  const [selectedDrinkKind, setSelectedDrinkKind] = useState(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("잔");

  const handleDrinkKindSelection = (drinkKind) => {
    if (selectedDrinkKind === drinkKind) {
      // 이미 선택된 버튼을 다시 누를 경우 선택 해제
      setSelectedDrinkKind("");
    } else {
      // 다른 버튼을 선택한 경우 선택 상태로 변경
      setSelectedDrinkKind(drinkKind);
    }
  };

  // 스타일을 선택된 버튼에 따라 동적으로 적용
  const getButtonStyle = (drinkKind) => {
    if (selectedDrinkKind === drinkKind) {
      return styles.selectedButton;
    }
    return styles.drinkButton;
  };

  const getButtonTextStyle = (drinkKind) => {
    if (selectedDrinkKind === drinkKind) {
      return styles.selectedButtonText;
    }
    return styles.ButtonText;
  };

  const goToPreviousStep = () => {
    navigation.navigate("AddInfoStep2", {
      height: height,
      weight: weight,
      gender: gender,
    });
  };

  const handleSubmitInfo = () => {
    const drinkInfo = {
      category: selectedDrinkKind,
      drinkUnit: unit,
      drinkAmount: amount,
    };

    saveUserInfo(weight, height, gender, address, drinkInfo)
      .then(async (res) => {
        console.log("제출 성공", res.tokenInfo.acessToken);
        const accessToken = res.tokenInfo.acessToken;
        await AsyncStorage.setItem("accessToken", accessToken);
        navigation.navigate("BottomTab");
      })
      .catch((error) => {
        console.error("추가정보 입력 실패", error);
      });
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Text>선택한 주소: {address}</Text> */}
      <DotIndicator activeIndex={3} />
      <Text style={styles.title}>주량</Text>
      <View style={styles.drinkSelection}>
        <TouchableOpacity
          style={getButtonStyle("소주")}
          onPress={() => handleDrinkKindSelection("소주")}
        >
          <Text style={getButtonTextStyle("소주")}>소주</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("맥주")}
          onPress={() => handleDrinkKindSelection("맥주")}
        >
          <Text style={getButtonTextStyle("맥주")}>맥주</Text>
        </TouchableOpacity>
      </View>

      {/* 선택한 음료 표시 */}
      {selectedDrinkKind && (
        <Text style={styles.selectedDrink}>
          선택한 음료: {selectedDrinkKind}
        </Text>
      )}

      {/* 주량 입력 */}
      <TextInput
        style={styles.amountInput}
        placeholder="주량을 입력하세요"
        value={amount}
        onChangeText={(text) => setAmount(text)}
        keyboardType="numeric"
      />

      {/* 주량 단위 선택 */}
      <Picker
        selectedValue={unit}
        onValueChange={(itemValue) => setUnit(itemValue)}
        style={styles.unitPicker}
      >
        <Picker.Item label="잔" value="잔" />
        <Picker.Item label="병" value="병" />
      </Picker>
      <View>
        <Button
          mode="contained"
          buttonColor={"#384BAD"}
          onPress={goToPreviousStep}
        >
          Previous
        </Button>
        <Button
          mode="contained"
          buttonColor={"#384BAD"}
          onPress={handleSubmitInfo}
        >
          Submit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  drinkSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    gap: 10,
  },
  drinkButton: {
    backgroundColor: "#0477BF",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },
  selectedButton: {
    backgroundColor: "#384BAD",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },
  selectedButtonText: {
    fontSize: 20,
    color: "white",
  },
  ButtonText: {
    fontSize: 20,
    color: "white",
  },
  selectedDrink: {
    fontSize: 16,
    marginTop: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  unitPicker: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
  },
});

export default AddInfoStep3Screen;
