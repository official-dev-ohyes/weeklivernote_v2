import React, { useEffect, useState, useLayoutEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { StyleSheet, ScrollView, View } from "react-native";
import UserStatistics from "../components/MyPage/template/UserStatistics";
import { fetchUserNonAlc, fetchUserProfile } from "../api/mypageApi";
import UserNonAlc from "../components/MyPage/template/UserNonAlc";
import SettingsIconButton from "../components/MyPage/SettingsIconButton";
import Profile from "../components/MyPage/template/Profile";
import { useFocusEffect } from "@react-navigation/native";
interface DrinkInfo {
  category: string;
  drinkAmount: number;
  drinkUnit: string;
}

interface UserProfile {
  address: string;
  alcoholLimit: number;
  gender: string;
  height: number;
  nickname: string;
  profileImg: string | null;
  weight: number;
  drinkInfo?: DrinkInfo;
}

interface AlcoholStatistics {
  maxNonAlcPeriod: number; // 최장금주기간
  nowNonAlcPeriod: number; // 현재금주기간
  drinkYearAmount: number; // 올해음주량
}

interface UserProfileProps {
  userProfile: UserProfile;
  alcoholStatistics: AlcoholStatistics;
  navigation: any;
}

function MyPageScreen(props: UserProfileProps) {
  const queryClient = useQueryClient();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    nickname: "",
    profileImg: "",
    gender: "",
    height: 0,
    weight: 0,
    alcoholLimit: 0,
    address: "",
    drinkInfo: null,
  });

  const [alcoholStatistics, setAlcoholStatistics] = useState<AlcoholStatistics>(
    {
      maxNonAlcPeriod: 0, // 최장금주기간
      nowNonAlcPeriod: 0, // 현재금주기간
      drinkYearAmount: 0, // 올해음주량
    }
  );
  const navigation = props.navigation;

  // 내비게이션 헤더에 설정페이지 이동 버튼 추가
  function handleHeaderButtonPressed() {
    navigation.navigate("Settings");
    // navigation을 프롭스로 받아와야하나?
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <SettingsIconButton onPress={handleHeaderButtonPressed} />;
      },
    });
  }, []);

  const {
    data: userProfileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery("userProfileData", async () => await fetchUserProfile());

  const {
    data: userNonAlcData,
    isLoading: isNonAlcLoading,
    isError: isNonAlcError,
  } = useQuery("userNonAlcData", async () => await fetchUserNonAlc());

  // console.log("오잉?", userProfileData);

  // useEffect(() => {
  //   if (!isProfileLoading && userProfileData) {
  //     setUserProfile(userProfileData);
  //   }
  //   if (!isNonAlcLoading && userNonAlcData) {
  //     setAlcoholStatistics(userNonAlcData);
  //   }
  // }, [userProfileData, isProfileLoading, navigator]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("여기로 안빠지나?", userProfileData);
      queryClient.invalidateQueries("userProfileData");
      if (!isProfileLoading && userProfileData) {
        setUserProfile(userProfileData);
      }
      if (!isNonAlcLoading && userNonAlcData) {
        setAlcoholStatistics(userNonAlcData);
      }
    }, [userProfileData, isProfileLoading])
  );

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <Profile navigation={navigation} userData={userProfile} />
          <UserNonAlc alcoholData={alcoholStatistics} />
          <UserStatistics />
        </View>
      </View>
    </ScrollView>
  );
}
//
const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    backgroundColor: "#F7F9FF",
  },
  subContainer: {
    flexDirection: "column",
    gap: 25,
    marginHorizontal: 15,
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
  },
});

export default MyPageScreen;
