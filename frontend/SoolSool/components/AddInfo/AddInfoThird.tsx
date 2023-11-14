import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-root-toast";
import { adaptiveIcon, drink01, drink04 } from "../../assets";

function AddInfoThird({
  drinkCategory,
  setDrinkCategory,
  drinkUnit,
  setDrinkUnit,
  drinkAmount,
  setDrinkAmount,
  onNextClick,
}) {
  const [selectedDrinkKind, setSelectedDrinkKind] = useState(null);
  const handleDrinkKindSelection = (drinkKind) => {
    if (selectedDrinkKind === drinkKind) {
      // 이미 선택된 버튼을 다시 누를 경우 선택 해제
      setSelectedDrinkKind("");
      setDrinkCategory("");
    } else {
      // 다른 버튼을 선택한 경우 선택 상태로 변경
      setSelectedDrinkKind(drinkKind);
      setDrinkCategory(drinkKind);
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

  const getImageURL = () => {
    if (selectedDrinkKind === null) {
      return adaptiveIcon;
    } else if (selectedDrinkKind === "소주") {
      return drink01;
    } else {
      return drink04;
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Text>선택한 주소: {address}</Text> */}
      <Text style={styles.title}>회원님의 주량을 알려주세요</Text>
      <View>
        <Image source={getImageURL()} style={styles.imageBox} />
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
            선택한 주종: {selectedDrinkKind}
          </Text>
        )}
        <View style={styles.rowContainer}>
          {/* 주량 입력 */}
          <TextInput
            style={styles.amountInput}
            placeholder="주량을 입력하세요"
            value={drinkAmount}
            onChangeText={(text) => setDrinkAmount(text)}
            keyboardType="numeric"
          />

          {/* 주량 단위 선택 */}
          <Picker
            selectedValue={drinkUnit}
            onValueChange={(itemValue) => setDrinkUnit(itemValue)}
            style={styles.unitPicker}
            mode="dropdown"
          >
            <Picker.Item label="잔" value="잔" />
            <Picker.Item label="병" value="병" />
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 50,
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: "auto",
    marginLeft: "auto",
  },
  drinkSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    gap: 10,
  },
  drinkButton: {
    backgroundColor: "#DBEBF5",
    // padding: 5,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  selectedButton: {
    backgroundColor: "#363C4B",
    // padding: 5,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  selectedButtonText: {
    fontSize: 17,
    color: "white",
  },
  ButtonText: {
    fontSize: 17,
    color: "black",
  },
  selectedDrink: {
    fontSize: 16,
    marginVertical: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 8,
    // marginBottom: 16,
    width: "60%",
  },
  unitPicker: {
    borderRadius: 8,
    width: "40%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  imageBox: {
    width: 100,
    height: 100,
    marginRight: "auto",
    marginLeft: "auto",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddInfoThird;
