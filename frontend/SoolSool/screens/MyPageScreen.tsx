import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { StyleSheet, Text, ImageBackground, View } from "react-native";
import UserProfile from "../components/MyPage/template/UserProfile";
import UserStatistics from "../components/MyPage/template/UserStatistics";
import { background_mypage } from "../assets";
import MyPageUpperBar from "../components/MyPage/template/MyPageUpperBar";
import { fetchUserProfile } from "../api/mypageApi";
import { createDrink, fetchDrink } from "../api/drinkRecordApi";
import UserNonAlc from "../components/MyPage/template/UserNonAlc";

// interface UserStatistics {
//   weekly: Record<string, [number, number][]>;
//   yearly: Record<string, [number, number][]>;
//   maxNonAlcPeriod: string;
//   nowNonAlcPeriod: string;
//   drinkYearAmount: string;
// }

interface UserData {
  weight: number;
  gender: string;
  address: string;
  nickname: string;
  profileImage: string;
  alcoholAmount: number;
}

function MyPageScreen({ navigation }) {

  console.log("test호출",fetchDrink("2023-10-09"));
  // const [userStatistics, setUserStatistics] = useState<UserStatistics>({ weekly: {}, yearly: {}, maxNonAlcPeriod: "", nowNonAlcPeriod: "", drinkYearAmount: "" });
  const [userData, setUserData] = useState<UserData>({
    weight: 70,
    gender: "남자",
    address: "부산시 녹산 어쩌구 SSAFY",
    profileImage: "#",
    nickname: "오예스",
    alcoholAmount: 30,
  });

  const [nonAlc,setNonAlc] = useState<number>(10);

  // const {
  //   data: userData,
  //   isLoading,
  //   isError,
  // } = useQuery("userProfile", fetchUserProfile);

  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (isError) {
  //   return <Text>Error...</Text>;
  // }

  return (
    <View style={styles.mainContainer}>
      <MyPageUpperBar />
      <UserProfile userData={userData} />
      <UserNonAlc nonAlc={nonAlc}/>
      <UserStatistics />
    </View>
  );
}
//
const styles = StyleSheet.create({
  mainContainer: {
    // borderWidth: 1,
    // borderColor: "black",
    flexDirection: "column",
    gap: 15,
    marginHorizontal: 15,
  },
});

export default MyPageScreen;
