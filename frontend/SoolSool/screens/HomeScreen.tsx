import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { DrinkToday } from "../models/DrinkToday";
import { calculateTimeDifference } from "../utils/timeUtils";

import { StyleSheet, View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import DrinkController from "../components/Home/DrinkController";
import UserStatus from "../components/Home/UserStatus";

function HomeScreen() {
  const [drinkToday, setDrinkToday] = useState<DrinkToday | null>(null);

  const date = new Date("2023-10-24T15:30:00");

  useEffect(() => {
    setDrinkToday(
      new DrinkToday({
        drinkTotal: 1000,
        // alcoholAmount: 35.8,
        alcoholAmount: 0,
        drinkStartTime: date.toDateString(),
        height: 157,
        weight: 58,
        gender: "female",
      })
    );
  }, []);

  const timeSinceDrink = calculateTimeDifference(date);

  // console.log(
  //   "what are you..I mean seriously",
  //   typeof drinkToday.intoxicationImage
  // );

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
      <View>
        {/* <ActivityIndicator animating={true} color={}/> */}
        <ActivityIndicator animating={true} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootScreen}>
      <UserStatus
        measurementUnit="ml"
        amount={drinkToday.drinkTotal}
        period={timeSinceDrink}
        imageSource={drinkToday.intoxicationImage}
      />
      <DrinkController />
    </View>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    margin: 12,
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  cardImageContainer: {
    width: 200,
    height: 200,
  },
});

export default HomeScreen;
