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

function AddInfoStep3Screen({ navigation, route }) {
  const { address } = route.params;
  const [selectedDrinkKind, setSelectedDrinkKind] = useState(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("잔");

  const goToPreviousStep = () => {
    navigation.navigate("AddInfoStep2");
  };
  return (
    <View>
      {/* <Text>선택한 주소: {address}</Text> */}
      <Text style={styles.title}>주량</Text>
      <View style={styles.drinkSelection}>
        <TouchableOpacity
          style={[
            styles.drinkButton,
            selectedDrinkKind === "소주" ? styles.selectedButton : null,
          ]}
          onPress={() => setSelectedDrinkKind("소주")}
        >
          <Text style={styles.drinkButtonText}>소주</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.drinkButton,
            selectedDrinkKind === "맥주" ? styles.selectedButton : null,
          ]}
          onPress={() => setSelectedDrinkKind("맥주")}
        >
          <Text style={styles.drinkButtonText}>맥주</Text>
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
      <Button mode="contained" onPress={goToPreviousStep}>
        Previous
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  drinkSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  drinkButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "lightblue",
  },
  drinkButtonText: {
    fontSize: 16,
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
