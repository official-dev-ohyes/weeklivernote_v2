import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { DrinkToday } from "../models/DrinkToday";

import { StyleSheet, View, Text, BackHandler } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import HomeCarousel from "../components/Home/HomeCarousel";
import SafeDriveInfo from "../components/Home/SafeDriveInfo";
import DrinkController from "../components/Home/DrinkController";
import { drinkTodayAtom } from "../recoil/drinkTodayAtom";
import { currentDrinksAtom } from "../recoil/currentDrinksAtom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { fetchDrink } from "../api/drinkRecordApi";
import { getToday } from "../utils/timeUtils";
import { getIdByCategoryAndUnit } from "../utils/drinkUtils";

function HomeScreen() {
  const [drinkToday, setDrinkToday] = useRecoilState(drinkTodayAtom);
  // const setCurrentDrinks = useSetRecoilState(currentDrinksAtom);
  const [currentDrinks, setCurrentDrinks] = useRecoilState(currentDrinksAtom);
  const today = getToday();
  // const today = "2023-11-01";

  // useEffect(() => {
  //   const backAction = () => {
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => {
  //     backHandler.remove();
  //     console.log("I'm leaving");
  //   };
  // }, []);

  const { data, isLoading, isError } = useQuery("drinkToday", async () => {
    const response = await fetchDrink(today);
    return response;
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries("drinkToday");
  }, [currentDrinks]);

  useEffect(() => {
    if (data) {
      if (data.drinkTotal === 0) {
        setDrinkToday(new DrinkToday(data));
      } else {
        const drinkTodayData = {
          drinkTotal: data.drinkTotal,
          alcoholAmount: data.alcoholAmount,
          drinkStartTime: data.drinkStartTime,
          height: data.height,
          weight: data.weight,
          gender: data.gender,
        };

        setDrinkToday(new DrinkToday(drinkTodayData));

        const currentDrinksObject = {};
        data.drinks.forEach((drink) => {
          const id = getIdByCategoryAndUnit(drink.category, drink.drinkUnit);
          if (currentDrinksObject.hasOwnProperty(id)) {
            currentDrinksObject[id] += drink.drinkAmount;
          } else {
            currentDrinksObject[id] = drink.drinkAmount;
          }
        });

        setCurrentDrinks(currentDrinksObject);
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator animating={true} color="#0477BF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return <Text>Error!!!</Text>;
  }

  if (!drinkToday) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color="#03174C" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <HomeCarousel />
      <View style={styles.controllerContainer}>
        <SafeDriveInfo
          bloodAlcoholContent={drinkToday.bloodAlcoholContent}
          drinkStartTime={drinkToday.drinkStartTime}
          requiredTimeToDrive={drinkToday.cannotDriveFor}
        />
        <DrinkController />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    margin: 12,
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  controllerContainer: {
    margin: 24,
    marginTop: -400,
  },
});

export default HomeScreen;
