import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { DrinkToday } from "../models/DrinkToday";

import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import UserStatus from "../components/Home/UserStatus";
import DrinkController from "../components/Home/DrinkController";

function HomeScreen() {
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

  // const [drinkToday, setDrinkToday] = useState<DrinkToday | null>(null);

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

  return (
    <View style={styles.rootScreen}>
      <UserStatus measurementUnit="ml" amount={1000} period={2} />
      {/* <UserStatus measurementUnit="g" amount={35.8} period={5} /> */}
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
