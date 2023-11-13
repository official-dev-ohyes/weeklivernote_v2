import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
import { IconButton, Modal, Portal } from "react-native-paper";
import { useRecoilState } from "recoil";
import { drinkTodayAtom } from "../../recoil/drinkTodayAtom";
import Toast from "react-native-root-toast";
import _ from "lodash";
import { DrinkCarousel } from "./DrinkCarousel";
import CurrentDrinks from "./CurrentDrinks";
import drinksData from "../../data/drinks.json";
import { DrinkToday } from "../../models/DrinkToday";
import {
  getDrinkImageById,
  getDrinkAndAlcoholAmountById,
} from "../../utils/drinkUtils";
import { getToday } from "../../utils/timeUtils";
import {
  createDrink,
  updateDrink,
  deleteDrink,
  removeDrink,
} from "../../api/drinkRecordApi";

interface Drink {
  id: number;
  name: string;
  volume: number;
  unit: string;
  alcoholPercentage: number;
  alcoholAmount: number;
}

interface DrinkControllerProps {
  currentDrinks: Record<number, number>;
}

const DrinkController: React.FC<DrinkControllerProps> = ({ currentDrinks }) => {
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);
  const [drinkToday, setDrinkToday] =
    useRecoilState<DrinkToday>(drinkTodayAtom);
  const [currentDrinkList, setCurrentDrinkList] = useState(currentDrinks);
  const numberOfCurrentDrinkList = Object.keys(currentDrinkList).length;
  const defaultDrink = {
    id: 2,
    name: "소주",
    volume: 60,
    unit: "잔",
    alcoholPercentage: 19,
    alcoholAmount: 9.1,
  };
  const [selectedDrink, setSelectedDrink] = useState(defaultDrink);
  const imageSource = getDrinkImageById(selectedDrink.id);
  const selectedDrinkAlcoholInfo = useMemo(
    () => getDrinkAndAlcoholAmountById(selectedDrink.id),
    [selectedDrink]
  );

  const [value, setValue] = useState(0);
  const minValue = 0;
  const maxValue = 99;
  const minIsDisabled = useMemo(() => value <= minValue, [minValue, value]);
  const maxIsDisabled = useMemo(() => value >= maxValue, [maxValue, value]);

  const today = getToday();

  // useEffect(() => {
  //   const defaultDrinkLog = currentDrinkList[defaultDrink.id];
  //   console.log("soju", defaultDrinkLog);
  // setValue(defaultDrinkLog);
  // }, [defaultDrink.id]);

  useEffect(() => {
    setCurrentDrinkList(currentDrinks);
  }, [currentDrinks]);

  useEffect(() => {
    const selectedDrinkLog = currentDrinkList[selectedDrink.id];

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
    setCurrentDrinkList((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  // 음주 기록 초기화
  const handleLogReset = _.debounce(async () => {
    try {
      await removeDrink(today);

      setCurrentDrinkList({});
      setSelectedDrink(defaultDrink);

      const dataForUpdate = {
        drinkTotal: 0,
        alcoholAmount: 0,
        drinkStartTime: null,
      };
      const updatedDrinkToday = drinkToday.update(dataForUpdate);
      setDrinkToday(updatedDrinkToday);
    } catch (error) {
      Toast.show("음주 기록 초기화에 실패했습니다. 다시 시도해주세요.", {
        duration: Toast.durations.SHORT,
      });
      throw error;
    }
  }, 200);

  const handleDecrement = _.debounce(async () => {
    if (value > 0) {
      const newValue = value - 1;
      setValue(newValue);

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
        await deleteDrink(drinkData)
          .then(() => {
            setCurrentDrinkList((prev) => {
              const updatedCurrentDrinkList = { ...prev };
              delete updatedCurrentDrinkList[selectedDrink.id];
              return updatedCurrentDrinkList;
            });
          })
          .catch((error) => {
            Toast.show("다시 시도해주세요.", {
              duration: Toast.durations.SHORT,
            });
            throw error;
          });
      } else {
        await updateDrink(drinkData)
          .then(() => {
            handleLogChange(selectedDrink.id, newValue);
          })
          .catch((error) => {
            Toast.show("다시 시도해주세요.", {
              duration: Toast.durations.SHORT,
            });
            throw error;
          });
      }

      const dataForUpdate = {
        drinkTotal:
          drinkToday.drinkTotal - selectedDrinkAlcoholInfo.drinkAmount,
        alcoholAmount:
          drinkToday.alcoholAmount - selectedDrinkAlcoholInfo.alcoholAmount,
      };
      const updatedDrinkToday = drinkToday.update(dataForUpdate);
      setDrinkToday(updatedDrinkToday);
    }
  }, 200);

  const handleIncrement = _.debounce(async () => {
    const newValue = value + 1;
    setValue(newValue);

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
      await createDrink(drinkData)
        .then(() => {
          handleLogChange(selectedDrink.id, newValue);
          // 최초기록일 때 시작 시간 추가
          if (drinkToday.alcoholAmount === 0) {
            const dataForUpdate = {
              drinkTotal:
                drinkToday.drinkTotal + selectedDrinkAlcoholInfo.drinkAmount,
              alcoholAmount:
                drinkToday.alcoholAmount +
                selectedDrinkAlcoholInfo.alcoholAmount,
              drinkStartTime: new Date().toString(),
            };
            const updatedDrinkToday = drinkToday.update(dataForUpdate);
            setDrinkToday(updatedDrinkToday);

            return;
          }
        })
        .catch((error) => {
          Toast.show("다시 시도해주세요.", {
            duration: Toast.durations.SHORT,
          });
          throw error;
        });
    } else {
      await updateDrink(drinkData)
        .then(() => {
          handleLogChange(selectedDrink.id, newValue);
        })
        .catch((error) => {
          Toast.show("다시 시도해주세요.", {
            duration: Toast.durations.SHORT,
          });
          throw error;
        });
    }

    const dataForUpdate = {
      drinkTotal: drinkToday.drinkTotal + selectedDrinkAlcoholInfo.drinkAmount,
      alcoholAmount:
        drinkToday.alcoholAmount + selectedDrinkAlcoholInfo.alcoholAmount,
    };
    const updatedDrinkToday = drinkToday.update(dataForUpdate);
    setDrinkToday(updatedDrinkToday);
  }, 200);

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
        {numberOfCurrentDrinkList !== 0 ? (
          <>
            <IconButton
              icon="refresh"
              size={20}
              onPress={handleLogReset}
              iconColor="#FFFFFF"
              style={styles.iconContainer}
            />
            <CurrentDrinks
              currentDrinkData={currentDrinkList}
              allDrinkData={drinksData}
              onClickItem={getSelectedDrink}
            />
            <View style={styles.divider} />
          </>
        ) : (
          <>
            <View style={styles.emptyContainer} />
            <View style={styles.divider} />
          </>
        )}

        <View style={styles.stepperContainer}>
          <IconButton
            icon="minus"
            onPress={handleDecrement}
            disabled={minIsDisabled}
            iconColor="white"
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
            iconColor="white"
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
};

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    zIndex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#C6C6C6",
    padding: 4,
    marginBottom: 12,
    width: "100%",
  },
  imageContainer: {
    width: 55,
    height: 55,
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
    fontFamily: "LineRegular",
  },
  nameText: {
    fontSize: 13,
    marginTop: 5,
    color: "white",
  },
  emptyContainer: {
    height: 68,
  },
});

export default DrinkController;
