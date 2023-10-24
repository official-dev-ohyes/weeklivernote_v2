import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { StyleSheet, Text, View } from "react-native";
import SettingsIconButton from "../components/MyPage/SettingsIconButton";
import UserProfile from "../components/MyPage/UserProfile";
import UserStatistics from "../components/MyPage/UserStatistics";

// interface UserStatistics {
//   weekly: Record<string, [number, number][]>;
//   yearly: Record<string, [number, number][]>;
//   maxNonAlcPeriod: string;
//   nowNonAlcPeriod: string;
//   drinkYearAmount: string;
// }

function MyPageScreen({ navigation }) {
  // const [userStatistics, setUserStatistics] = useState<UserStatistics>({ weekly: {}, yearly: {}, maxNonAlcPeriod: "", nowNonAlcPeriod: "", drinkYearAmount: "" });

  //유저프로필 정보를 불러오는 함수
  const fetchUserProfileData = async () => {
    try {
      const response = await axios.get("/api/v1/user/info");
      return response.data;
    } catch (error) {
      throw new Error("user profile data를 가져오는데 실패");
    }
  };

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery("userProfile", fetchUserProfileData);

  function handleHeaderButtonPressed() {
    navigation.navigate("Settings");
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error...</Text>;
  }

  return (
    <View>
      <Text>My Page</Text>
      <SettingsIconButton onPress={handleHeaderButtonPressed} />
      <UserProfile userData={userData} />
      {/* <UserStatistics userStatistics={userStatistics} /> */}
    </View>
  );
}

const styles = StyleSheet.create({});

export default MyPageScreen;
