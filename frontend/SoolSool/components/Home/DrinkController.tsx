import { useEffect, useMemo, useState } from "react";
// import { useQuery } from "react-query";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
// import { useRecoilState, useSetRecoilState } from "recoil";
import { useRecoilState } from "recoil";
import { IconButton, Modal, Portal } from "react-native-paper";
import { DrinkCarousel } from "./DrinkCarousel";
import CurrentDrinks from "./CurrentDrinks";
import drinksData from "../../data/drinks.json";
import { getDrinkImageById } from "../../utils/drinkUtils";
import { currentDrinksAtom } from "../../recoil/currentDrinksAtom";
// import { drinkTodayAtom } from "../../recoil/drinkTodayAtom";
import {
  createDrink,
  updateDrink,
  deleteDrink,
  removeDrink,
} from "../../api/drinkRecordApi";
import { getToday } from "../../utils/timeUtils";

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
  const numberOfCurrentDrinks = Object.keys(currentDrinks).length;
  // const setDrinkToday = useSetRecoilState(drinkTodayAtom);
  const defaultDrink = {
    id: 2,
    name: "소주",
    volume: 50,
    unit: "잔",
    alcoholPercentage: 19,
  };
  const [selectedDrink, setSelectedDrink] = useState(defaultDrink);
  const imageSource = getDrinkImageById(selectedDrink.id);

  const [value, setValue] = useState(0);
  const minValue = 0;
  const maxValue = 99;
  const minIsDisabled = useMemo(() => value <= minValue, [minValue, value]);
  const maxIsDisabled = useMemo(() => value >= maxValue, [maxValue, value]);

  const today = getToday();

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

  const handleLogReset = async () => {
    try {
      await removeDrink(today);
    } catch (error) {
      console.error("Error while removing drink:", error);
      return;
    }

    setCurrentDrinks({});
    setSelectedDrink(defaultDrink);
  };

  const handleDecrement = () => {
    if (value > 0) {
      const newValue = value - 1;
      setValue(newValue);
      handleLogChange(selectedDrink.id, newValue);

      const drinkData = {
        drinks: [
          {
            category: selectedDrink.name,
            drinkUnit: selectedDrink.unit,
            drinkAmount: newValue,
          },
        ],
        drinkDate: today,
      };

      if (newValue === 0) {
        deleteDrink(drinkData)
          .then((res) => {
            console.log("Successfully delete the drink log.", res);
          })
          .catch((err) => {
            console.log("Fail to delete the drink log.", err);
          });

        setCurrentDrinks((prev) => {
          const updatedCurrentDrinks = { ...prev };
          delete updatedCurrentDrinks[selectedDrink.id];
          return updatedCurrentDrinks;
        });
      } else {
        updateDrink(drinkData)
          .then((res) => {
            console.log("Successfully update the drink log.", res);
          })
          .catch((err) => {
            console.log("Fail to update the drink log.", err);
          });
      }
    }
  };

  const handleIncrement = () => {
    const newValue = value + 1;
    setValue(newValue);
    handleLogChange(selectedDrink.id, newValue);

    const drinkData = {
      drinks: [
        {
          category: selectedDrink.name,
          drinkUnit: selectedDrink.unit,
          drinkAmount: newValue,
        },
      ],
      drinkDate: today,
    };

    if (newValue === 1) {
      createDrink(drinkData)
        .then((res) => {
          console.log("Successfully create a new drink log.", res);
        })
        .catch((err) => {
          console.log("Fail to create a new drink log.", err);
        });
    } else {
      updateDrink(drinkData)
        .then((res) => {
          console.log("Successfully update the drink log.", res);
        })
        .catch((err) => {
          console.log("Fail to update the drink log.", err);
        });
    }
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
          <DrinkCarousel
            data={drinksData}
            sendData={getSelectedDrink}
            onClose={handleModalClose}
          />
        </Modal>
      </Portal>

      <View style={styles.rootContainer}>
        {numberOfCurrentDrinks !== 0 ? (
          <>
            <IconButton
              icon="refresh"
              size={20}
              onPress={handleLogReset}
              iconColor="#6C6C6C"
              style={styles.iconContainer}
            />
            <CurrentDrinks
              currentDrinkData={currentDrinks}
              allDrinkData={drinksData}
              onClickItem={getSelectedDrink}
            />
            <View style={styles.divider} />
          </>
        ) : (
          <></>
        )}

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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: "100%",
    alignItems: "flex-end",
    position: "absolute",
    top: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#C6C6C6",
    padding: 4,
    marginBottom: 8,
    width: "100%",
  },
  imageContainer: {
    width: 60,
    height: 60,
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
    fontFamily: "Yeongdeok-Sea",
  },
  nameText: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
  },
});

export default DrinkController;
