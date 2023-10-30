import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { DrinkToday } from "../models/DrinkToday";
import { calculateTimeDifference } from "../utils/timeUtils";

import { StyleSheet, View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import HomeCarousel from "../components/Home/HomeCarousel";
import DrinkController from "../components/Home/DrinkController";

function HomeScreen() {
  const [drinkToday, setDrinkToday] = useState<DrinkToday | null>(null);
  const date = new Date("2023-10-27T15:30:00");

  // const fetchARandomActivity = async (url) => {
  //   try {
  //     const response = await axios.get(url);
  //     console.log("응답 데이터:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("요청 실패:", error);
  //     throw error;
  //   }
  // };
  // fetchARandomActivity("https://www.boredapi.com/api/activity");

  useEffect(() => {
    setDrinkToday(
      new DrinkToday({
        drinkTotal: 1000,
        alcoholAmount: 35.8,
        drinkStartTime: date.toDateString(),
        height: 157,
        weight: 58,
        gender: "female",
      })
    );
  }, []);

  // const fetchDrinkTodayData = async () => {
  //   try {
  //     const response = await axios.get("/api/v1/drink");
  //     return response.data;
  //   } catch (error) {
  //     throw new Error("당일 음주 정보 조회 실패");
  //   }
  // };

  // const { data, isLoading, isError } = useQuery(
  //   "drinkToday",
  //   fetchDrinkTodayData
  // );

  // useEffect(() => {
  //   if (data) {
  //     setDrinkToday(new DrinkToday(data));
  //   }
  // }, [data]);

  // if (isLoading) {
  //   return (
  //     <View>
  //       {/* <ActivityIndicator animating={true} color={}/> */}
  //       <ActivityIndicator animating={true} />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (isError) {
  //   return <Text>Error!!!</Text>;
  // }

  if (!drinkToday) {
    return (
      <View style={styles.loadingContainer}>
        {/* <ActivityIndicator animating={true} color={}/> */}
        <ActivityIndicator animating={true} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <HomeCarousel />
      <View style={styles.controllerContainer}>
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
    marginTop: -240,
  },
});

export default HomeScreen;
