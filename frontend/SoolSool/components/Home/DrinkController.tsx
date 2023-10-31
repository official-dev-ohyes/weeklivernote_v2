import { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
import { IconButton, Modal, Portal, Chip } from "react-native-paper";
import { DrinkCarousel } from "./DrinkCarousel";
import drinksData from "../../data/drinks.json";
import { getDrinkImageById } from "../../utils/drinkUtils";

import {
  drink01,
  drink02,
  drink03,
  drink04,
  drink05,
  drink06,
  drink07,
  drink08,
  drink09,
} from "../../assets/index";

const { width, height } = Dimensions.get("screen");

const drinkData = [
  drink01,
  drink02,
  drink03,
  drink04,
  drink05,
  drink06,
  drink07,
  drink08,
  drink09,
];

interface Drink {
  id: number;
  name: string;
  volume: number;
  unit: "병" | "잔";
  alcoholPercentage: number;
}

function DrinkController() {
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);

  const [selectedDrink, setSelectedDrink] = useState({
    id: 2,
    name: "소주",
    volume: 360,
    unit: "잔",
    alcoholPercentage: 19,
  });
  const imageSource = getDrinkImageById(selectedDrink.id);

  const [value, setValue] = useState(0);
  const minValue = 0;
  const maxValue = 99;
  const minIsDisabled = useMemo(() => value <= minValue, [minValue, value]);
  const maxIsDisabled = useMemo(() => value >= maxValue, [maxValue, value]);

  const handleModalOpen = () => {
    setIsDrinkModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDrinkModalOpen(false);
  };

  const handleDecrement = () => {
    setValue((prev) => {
      return prev - 1;
    });
  };

  const handleIncrement = () => {
    setValue((prev) => {
      return prev + 1;
    });
  };

  return (
    <>
      <Portal>
        <Modal
          visible={isDrinkModalOpen}
          onDismiss={handleModalClose}
          contentContainerStyle={styles.modalContainer}
        >
          <DrinkCarousel data={drinkData} />
        </Modal>
      </Portal>

      <View style={styles.rootContainer}>
        <View style={styles.chipsContainer}>
          <Chip mode="outlined" icon="blood-bag" style={styles.chip}>
            0.03 %
          </Chip>
          <Chip mode="outlined" icon="car-off" style={styles.chip}>
            08:30 까지
          </Chip>
        </View>
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
          <Text style={styles.nameText}>{selectedDrink.name}</Text>
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
  chipsContainer: {
    padding: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  chip: {
    marginHorizontal: 20,
    width: "40%",
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
    backgroundColor: "white",
    padding: 0,
    margin: 12,
    width: width * 0.95,
    height: height * 0.5,
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
