import { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IconButton, Modal, Portal } from "react-native-paper";
import { DrinkCarousel } from "./DrinkCarousel";
import drinksData from "../../data/drinks.json";
import { getDrinkImageById } from "../../utils/drinkUtils";
import { currentDrinksAtom } from "../../recoil/currentDrinksAtom";
import { drinkTodayAtom } from "../../recoil/drinkTodayAtom";

interface Drink {
  id: number;
  name: string;
  volume: number;
  unit: string;
  alcoholPercentage: number;
}

const { width, height } = Dimensions.get("screen");

function DrinkController() {
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);
  const [currentDrinks, setCurrentDrinks] = useRecoilState(currentDrinksAtom);
  const setDrinkToday = useSetRecoilState(drinkTodayAtom);
  const [selectedDrink, setSelectedDrink] = useState({
    id: 2,
    name: "소주",
    volume: 350,
    unit: "잔",
    alcoholPercentage: 19,
  });
  const imageSource = getDrinkImageById(selectedDrink.id);

  const [value, setValue] = useState(0);
  const minValue = 0;
  const maxValue = 99;
  const minIsDisabled = useMemo(() => value <= minValue, [minValue, value]);
  const maxIsDisabled = useMemo(() => value >= maxValue, [maxValue, value]);

  useEffect(() => {
    const selectedDrinkLog = currentDrinks[selectedDrink.id];

    if (selectedDrinkLog) {
      setValue(selectedDrinkLog);
    } else {
      setValue(0);
    }
  }, [selectedDrink]);

  const handleModalOpen = () => {
    setIsDrinkModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDrinkModalOpen(false);
  };

  const handleLogChange = (key: number, newValue: number) => {
    setCurrentDrinks((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  // const handleLogReset = () => {
  //   setCurrentDrinks({});
  // };

  const handleDecrement = () => {
    const newValue = value - 1;
    setValue(newValue);
    handleLogChange(selectedDrink.id, newValue);
  };

  const handleIncrement = () => {
    const newValue = value + 1;
    setValue(newValue);
    handleLogChange(selectedDrink.id, newValue);
    setDrinkToday((prev) => ({
      ...prev,
      drinkTotal: prev.drinkTotal + selectedDrink.volume,
      alcoholAmount:
        prev.alcoholAmount +
        selectedDrink.volume * selectedDrink.alcoholPercentage,
    }));
  };

  const getSelectedDrink = (drink: Drink) => {
    setSelectedDrink(drink);
  };

  return (
    <>
      <Portal>
        <Modal
          visible={isDrinkModalOpen}
          onDismiss={handleModalClose}
          contentContainerStyle={styles.modalContainer}
        >
          <DrinkCarousel data={drinksData} sendData={getSelectedDrink} />
        </Modal>
      </Portal>

      <View style={styles.rootContainer}>
        <View style={styles.stepperContainer}>
          <IconButton
            icon="minus"
            onPress={handleDecrement}
            disabled={minIsDisabled}
            size={32}
          />
          <Pressable onPress={handleModalOpen}>
            <ImageBackground
              source={imageSource}
              style={styles.imageContainer}
              resizeMode="contain"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.valueText}>{value}</Text>
              </View>
            </ImageBackground>
          </Pressable>
          <IconButton
            icon="plus"
            onPress={handleIncrement}
            disabled={maxIsDisabled}
            size={32}
          />
        </View>
        <Pressable onPress={handleModalOpen}>
          <Text style={styles.nameText}>
            {selectedDrink.name} ({selectedDrink.unit})
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  stepperContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "rgba(255,255,255,1)",
    padding: 0,
    margin: 12,
    width: width * 0.95,
    height: height * 0.4,
    borderRadius: 20,
  },
  valueText: {
    fontSize: 36,
  },
  nameText: {
    fontSize: 20,
  },
});

export default DrinkController;
