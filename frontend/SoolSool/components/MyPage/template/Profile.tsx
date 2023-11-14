import {
  Text,
  Pressable,
  Image,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DetailProfile from "../DetailProfile";
import { FAB, shadow } from "react-native-paper";
import { defaultImage } from "../../../assets";
import * as ImagePicker from "expo-image-picker";
import { updateProfileImage } from "../../../api/mypageApi";
import { showErrorAndRetry } from "../../../utils/showErrorUtils";

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
  setUserProfile: any;
}

function Profile(props: UserProfileProps) {
  const { userData, navigation, setUserProfile } = props;
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const handleEditImage = async () => {
    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return null;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (result.canceled) {
      return null;
    }

    console.log("새로운 프로필 이미지를 선택");
    console.log(result.assets[0].uri);

    const localUri = result.assets[0].uri;
    const uriParts = localUri.split("/");
    const fileName = uriParts[uriParts.length - 1];
    const uri =
      Platform.OS === "android" ? localUri : localUri.replace("file://", "");
    const type = `${result.assets[0].type}/${localUri.split(".").pop()}`;
    const body: any = new FormData();
    // console.log("여기서부터 다시 시작", result);
    // console.log("uri", uri);
    // console.log("type", type);
    // console.log("name", fileName);
    const file = {
      type: type,
      name: fileName,
      uri: uri,
    };
    // body.append("image", file);
    body.append("type", type);
    body.append("name", fileName);
    body.append("uri", uri);

    await updateProfileImage(body)
      .then(() => {
        console.log("이미지 업데이트 성공");

        setUserProfile((prevProfile) => ({
          ...prevProfile,
          profileImg: result.assets[0].uri,
        }));
      })
      .catch(() => {
        showErrorAndRetry("알림", "잠시 후 다시 시도해주세요");
      });
  };

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
  }, [userData]);

  const handleEdit = () => {
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

        <Pressable style={styles.editIcon} onPress={handleEditImage}>
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

      <FAB icon="pencil" style={styles.fab} onPress={handleEdit} />
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Profile;
