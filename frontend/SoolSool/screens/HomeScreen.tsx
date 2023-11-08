import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { DrinkToday } from "../models/DrinkToday";
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Button,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
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
import { schedulePushNotification } from "../components/Notification/LocalNotification";
import { mainbackground } from "../assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
function HomeScreen({ navigation }) {
  const [drinkToday, setDrinkToday] = useRecoilState(drinkTodayAtom);
  // const setCurrentDrinks = useSetRecoilState(currentDrinksAtom);
  const [currentDrinks, setCurrentDrinks] = useRecoilState(currentDrinksAtom);
  const today = getToday();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token === null) {
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("토큰을 가져오는 중에 오류가 발생했습니다:", error);
      }
    };
    fetchToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => {
        backHandler.remove();
      };
    }, [])
  );

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
        {/* <Button title="test" onPress={schedulePushNotification} /> */}
        <DrinkController />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // rootScreen: {
  //   margin: 12,
  //   display: "flex",
  //   alignItems: "center",
  //   flex: 1,
  // },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  controllerContainer: {
    margin: 24,
    marginTop: -320,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  background: {
    height: "100%",
  },
});

export default HomeScreen;
