import React, { useState, useEffect } from "react";
import { DrinkToday } from "../models/DrinkToday";
import { StyleSheet, View, Text, BackHandler, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import HomeCarousel from "../components/Home/HomeCarousel";
import SafeDriveInfo from "../components/Home/SafeDriveInfo";
import DrinkController from "../components/Home/DrinkController";
import { drinkTodayAtom } from "../recoil/drinkTodayAtom";
import { useRecoilState } from "recoil";
import { fetchDrink } from "../api/drinkRecordApi";
import { getToday } from "../utils/timeUtils";
import { getIdByCategoryAndUnit } from "../utils/drinkUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [drinkToday, setDrinkToday] = useRecoilState(drinkTodayAtom);
  const [currentDrinks, setCurrentDrinks] = useState<Record<number, number>>(
    {}
  );
  const today = getToday();

  // 회원 정보 없을 시 로그인 화면으로 이동
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

  // 메인에서 뒤로가기 방지
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

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await fetchDrink(today);
          if (data) {
            const drinkTodayData = {
              drinkTotal: data.drinkTotal,
              alcoholAmount: data.alcoholAmount,
              drinkStartTime: data.drinkStartTime,
              height: data.height,
              weight: data.weight,
              gender: data.gender,
              bacAt5: data.todayBloodAlcohol,
              alcoholAt5: data.todayLiverAlcohol,
            };

            setDrinkToday(new DrinkToday(drinkTodayData));

            const currentDrinksObject = {};
            data.drinks.forEach((drink) => {
              const id = getIdByCategoryAndUnit(
                drink.category,
                drink.drinkUnit
              );

              if (currentDrinksObject.hasOwnProperty(id)) {
                currentDrinksObject[id] += drink.drinkAmount;
              } else {
                currentDrinksObject[id] = drink.drinkAmount;
              }
            });

            setCurrentDrinks(currentDrinksObject);
          }
        } catch (error) {
          console.error("데이터를 가져오는 동안 에러 발생:", error);
        }
      };

      fetchData();
    }, [])
  );

  const screenHeight = Dimensions.get("window").height;

  if (!drinkToday) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color="#03174C" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[{ height: screenHeight }, styles.mainContainer]}>
      <HomeCarousel />
      <View style={styles.controllerContainer}>
        <SafeDriveInfo
          bloodAlcoholContent={drinkToday.bloodAlcoholContent}
          drinkStartTime={drinkToday.drinkStartTime}
          requiredTimeToDrive={drinkToday.cannotDriveFor}
          additionalTimeForDrive={drinkToday.stillNeedSoberTimeFor}
        />
        <DrinkController currentDrinks={currentDrinks} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  controllerContainer: {
    margin: 24,
    marginTop: -340,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  background: {
    height: "100%",
  },
});

export default HomeScreen;
