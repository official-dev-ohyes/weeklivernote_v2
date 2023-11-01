import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { DrinkToday } from "../models/DrinkToday";

import { StyleSheet, View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import HomeCarousel from "../components/Home/HomeCarousel";
import SafeDriveInfo from "../components/Home/SafeDriveInfo";
import DrinkController from "../components/Home/DrinkController";
import { drinkTodayAtom } from "../recoil/drinkTodayAtom";
import { useRecoilState } from "recoil";

function HomeScreen() {
  const [drinkToday, setDrinkToday] = useRecoilState(drinkTodayAtom);
  const date = new Date("2023-10-30T15:30:00");

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
        <ActivityIndicator animating={true} color="#03174C" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <HomeCarousel />
      <View style={styles.controllerContainer}>
        <SafeDriveInfo />
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
    marginTop: -250,
  },
});

export default HomeScreen;
