import { Text, Pressable, Image, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import DetailProfile from "../DetailProfile";
import { showErrorAndRetry } from "../../../utils/showErrorUtils";
import { defaultImage } from "../../../assets";

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

interface DrinkInfo {
  category: string;
  drinkAmount: number;
  drinkUnit: string;
}

interface UserProfileProps {
  userData: UserProfile;
  navigation: any;
}

function Profile(props: UserProfileProps) {
  const { userData, navigation } = props;

  useEffect(() => {
    // console.log("이미지url", userData.profileImg);
    // console.log("닉네임", userData.nickname);
    // console.log("주소", userData.address);
    // console.log("성별", userData.gender);
    // console.log("신장", userData.height);
    // console.log("체중", userData.weight);
    // console.log(
    //   "주량",
    //   userData.drinkInfo.category,
    //   userData.drinkInfo.drinkAmount,
    //   userData.drinkInfo.drinkUnit
    // );
  }, []);

  const handleEdit = () => {
    console.log("에딧아이콘 클릭");
    // showErrorAndRetry("준비 중", "추후 업데이트 예정입니다");
    navigation.navigate("EditProfile");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={
            userData.profileImg ? { uri: userData.profileImg } : defaultImage
          }
          style={styles.profileImage}
        />

        <Pressable style={styles.editIcon} onPress={handleEdit}>
          <Ionicons name="pencil" color={"white"} size={15} />
        </Pressable>
      </View>

      <Text style={styles.userInfoText}>{userData.nickname}</Text>

      <View style={styles.userAddress}>
        <Ionicons name="location" color={"white"} size={20} />
        <Text style={styles.addressText}>{userData.address}</Text>
      </View>

      <View style={styles.userDetail}>
        <DetailProfile userData={userData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    gap: 15,
    // borderRadius: 30,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginTop: 30,
    // 그림자 추가 (Android 및 iOS 모두에서 동작)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // 안드로이드에서 그림자 효과 추가
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  userInfoText: {
    fontSize: 17,
    // marginTop: 10,
    marginBottom: 3,
  },
  addressText: {
    fontSize: 15,
    color: "white",
  },
  userAddress: {
    width: "auto",
    paddingRight: 22,
    paddingLeft: 15,
    height: 35,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#363C4B",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 500,
    marginTop: 5,
  },
  userDetail: {
    // flex: 1,
    width: "100%",
  },
  editIcon: {
    width: "auto",
    height: "auto",
    padding: 5,
    backgroundColor: "#363C4B",
    borderRadius: 50,
    position: "absolute",
    top: 98,
    right: 10,
  },
  profileContainer: {},
});

export default Profile;
