import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, IconButton } from "react-native-paper";
import NowAddedAlcohols from "./NowAddedAlcohols";

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

const AlcoholInput: React.FC<AlcoholAreaProps> = ({
  selectedAlcohol,
  setSelectedAlcohol,
  value,
  setValue,
  selectedUnit,
  setSelectedUnit,
  handleDecrement,
  handleIncrement,
  handleAdd,
  alcoholRecord,
  onDeleteRecord,
}) => {
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

  const onlyShotDrinks = ["소맥", "하이볼", "칵테일(약)", "칵테일(강)"];

  return (
    <View style={styles.total}>
      <View style={styles.alcoholArea}>
        <View style={styles.tagArea}>
          <NowAddedAlcohols
            alcoholRecord={alcoholRecord}
            onDeleteRecord={onDeleteRecord}
          />
        </View>
        <View style={styles.alcoholInput}>
          <Text style={styles.word}>술</Text>
          <View style={styles.category}>
            <View style={styles.alcoholInput}>
              <View style={styles.category}>
                <Picker
                  mode="dropdown"
                  selectedValue={selectedAlcohol}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedAlcohol(itemValue)
                  }
                >
                  {alcoholCategory.map((category, index) => (
                    <Picker.Item
                      key={index}
                      label={category}
                      value={category}
                    />
                  ))}
                </Picker>
              </View>
            </View>
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
    height: "10%",
  },
  tagArea: {
    height: "auto",
    marginVertical: 10,
  },
  tag: {
    height: 70,
  },
  alcoholArea: {
    height: "20%",
    borderRadius: 5,
    justifyContent: "space-around",
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
    // margin: "1%",
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
    paddingBottom: "3%",
  },
  button: {
    flex: 2,
    margin: "1%",
  },
});

export default AlcoholInput;
