import React from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, IconButton } from "react-native-paper";

interface AlcoholRecord {
  category: string;
  drinkUnit: string;
  drinkAmount: number;
}

interface AlcoholAreaProps {
  selectedAlcohol: string;
  setSelectedAlcohol: (value: string) => void;
  value: number;
  setValue: (value: number) => void;
  selectedUnit: string;
  setSelectedUnit: (value: string) => void;
  handleDecrement: () => void;
  handleIncrement: () => void;
  handleAdd: () => void;
  alcoholRecord: AlcoholRecord[];
  onDeleteRecord: (index: number) => void;
}

const AlcoholInput = ({ alcoholRecord, setAlcoholRecord }) => {
  const onlyShotDrinks = ["소맥", "하이볼", "칵테일(약)", "칵테일(강)"];
  const alcoholCategory = [
    "소주",
    "맥주",
    "소맥",
    "와인",
    "하이볼",
    "막걸리",
    "칵테일(약)",
    "칵테일(강)",
    "위스키",
  ];

  const [selectedAlcohol, setSelectedAlcohol] = useState("소주");
  const [value, setValue] = useState(0); // 음주량
  const [selectedUnit, setSelectedUnit] = useState("잔");

  // 음주량 수정
  const handleDecrement = () => {
    if (value > 0) {
      const newValue = value - 0.5;
      setValue(newValue);
    }
  };
  const handleIncrement = () => {
    const newValue = value + 0.5;
    setValue(newValue);
  };
  const handleAdd = () => {
    const newRecord = {
      category: selectedAlcohol,
      drinkUnit: selectedUnit,
      drinkAmount: value,
    };

    const existingRecordIndex = alcoholRecord.findIndex(
      (record) =>
        record.category === selectedAlcohol && record.drinkUnit === selectedUnit
    );

    if (existingRecordIndex >= 0) {
      const updatedRecords = [...alcoholRecord];
      updatedRecords[existingRecordIndex].drinkAmount += value;
      setAlcoholRecord(updatedRecords);
    } else {
      if (newRecord.drinkAmount > 0) {
        setAlcoholRecord((prevRecords) => [...prevRecords, newRecord]);
      } else {
        Alert.alert("알림", "수량을 조절하세요.");
      }
    }

    setValue(0);
    setSelectedAlcohol("소주");
    setSelectedUnit("잔");
  };

  // 주종별 음주 기록 삭제
  const handleDeleteRecord = (index) => {
    const updatedRecords = [...alcoholRecord];
    updatedRecords.splice(index, 1);
    setAlcoholRecord(updatedRecords);
  };

  return (
    <View style={styles.total}>
      <ScrollView style={styles.tagArea}>
        {alcoholRecord.length ? (
          <View style={styles.oneline}>
            {alcoholRecord.map((record, index) => (
              <View key={index} style={styles.alcoholInfo}>
                <Text style={styles.innerText}>
                  {record.category}
                  <Text style={styles.innerText}> {record.drinkAmount}</Text>
                  <Text style={styles.innerText}>{record.drinkUnit} </Text>
                </Text>
                <TouchableOpacity onPress={() => handleDeleteRecord(index)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.textBox}>
            <Text style={styles.text}>
              추가 버튼을 눌러 마신 술을 기록하세요
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.alcoholArea}>
        <View style={styles.alcoholInput}>
          <Text style={styles.word}>술</Text>
          <View style={styles.category}>
            <Picker
              mode="dropdown"
              selectedValue={selectedAlcohol}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedAlcohol(itemValue)
              }
            >
              {alcoholCategory.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.alcoholInput}>
          <Text style={styles.word}>양</Text>
          <View style={styles.alcoholAmount}>
            <IconButton icon="minus" onPress={handleDecrement} size={15} />
            <Text>{value}</Text>
            <IconButton icon="plus" onPress={handleIncrement} size={15} />
          </View>
          <View style={styles.alcoholUnit}>
            <Picker
              mode="dropdown"
              selectedValue={selectedUnit}
              onValueChange={(itemValue, itemIndex) => {
                if (onlyShotDrinks.includes(selectedAlcohol)) {
                  setSelectedUnit("잔");
                } else {
                  setSelectedUnit(itemValue);
                }
              }}
            >
              <Picker.Item label="잔" value="잔" />
              {!onlyShotDrinks.includes(selectedAlcohol) && (
                <Picker.Item label="병" value="병" />
              )}
            </Picker>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            textColor={"#363C4B"}
            mode="outlined"
            onPress={() => {
              setValue(0);
            }}
          >
            초기화
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleAdd}
            buttonColor={"#363C4B"}
          >
            추가
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  total: {
    // height: "100%",
    // backgroundColor: "blue",
    flexDirection: "column",
  },
  tagArea: {
    height: "50%",
    marginVertical: "5%",
    backgroundColor: "#f6f6f6",
    padding: "2%",
  },
  alcoholArea: {
    height: "60%",
    borderRadius: 5,
    backgroundColor: "white",
  },
  alcoholInput: {
    height: "25%",
    margin: "1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  word: {
    flex: 0.5,
    fontWeight: "bold",
    fontSize: 16,
  },
  category: {
    flex: 2,
    height: "90%",
    justifyContent: "center",
  },
  alcoholAmount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "90%",
  },
  alcoholUnit: {
    flex: 1,
    height: "90%",
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: "3%",
  },
  button: {
    flex: 2,
    margin: "1%",
  },
  oneline: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  alcoholInfo: {
    flexDirection: "row",
    marginRight: 5,
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 30,
    borderWidth: 1,
    borderColor: "#363C4B",
    borderRadius: 50,
  },
  innerText: {
    fontSize: 14,
  },
  textBox: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  deleteButton: {
    fontSize: 16,
    color: "red",
  },
});

export default AlcoholInput;
