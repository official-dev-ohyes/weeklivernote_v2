import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { StyleSheet, Text, ImageBackground, View } from "react-native";
import UserProfile from "../components/MyPage/template/UserProfile";
import UserStatistics from "../components/MyPage/template/UserStatistics";
import { background_mypage } from "../assets";
import MyPageUpperBar from "../components/MyPage/template/MyPageUpperBar";
import { fetchUserProfile } from "../api/mypageApi";
import { createDrink } from "../api/drinkRecordApi";

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
  // const [userStatistics, setUserStatistics] = useState<UserStatistics>({ weekly: {}, yearly: {}, maxNonAlcPeriod: "", nowNonAlcPeriod: "", drinkYearAmount: "" });
  const [userData, setUserData] = useState<UserData>({
    weight: 70,
    gender: "남자",
    address: "부산시 녹산 어쩌구 SSAFY",
    profileImage: "#",
    nickname: "오예스",
    alcoholAmount: 30,
  });

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
  const drinkData = {
    drinks: [
      {
        category: "소주",
        drinkUnit: "잔",
        drinkAmount: 1,
      },
    ],
    drinkDate: "2023-10-26",
    memo: "많이 마신 날",
    imgUrl: "#",
    hangover: "숙취",
    alcoholConc: 10,
  };

  const tempres = createDrink(drinkData);
  console.log("제발 나와줘", tempres);
  return (
    <ImageBackground
      source={background_mypage} // 이미지 파일 경로
      style={styles.backgroundImage}
    >
      <MyPageUpperBar />
      <UserProfile userData={userData} />
      <UserStatistics />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    // resizeMode: "center",
  },
});

export default MyPageScreen;
