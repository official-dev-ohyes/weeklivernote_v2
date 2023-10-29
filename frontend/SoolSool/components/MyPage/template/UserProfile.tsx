import { Text, Pressable, Image, StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { cheeseDuck } from "../../../assets";
import DetailProfile from "../DetailProfile";

interface UserData {
  weight: number;
  gender: string;
  address: string;
  nickname: string;
  profileImage: string;
  alcoholAmount: number;
}

interface UserProfileProps {
  userData: UserData;
}

function UserProfile(props: UserProfileProps) {
  const { userData } = props;

  return (
    <View style={styles.mainContainer}>
      <Image source={cheeseDuck} style={styles.profileImage} />
      
      <Text style={styles.userInfoText}>{userData.nickname}</Text>

      <View style={styles.userAddress}>
        <Ionicons name="home" size={15} />
        <Text style={styles.userInfoText}>{userData.address}</Text>
      </View >

      <View style={styles.userDetail}>
        <DetailProfile userData={userData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFFF",
    flexDirection: "column",
    gap: 15,
    borderRadius: 20,
    alignItems: "center"
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  userInfoText: {
    fontSize: 14,
    marginBottom: 3,
  },
  userAddress: {
    flexDirection: "row",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 500,
    marginTop: 30,
    borderWidth: 2,
    borderColor: "lightgray",
  },
  userDetail :{
    // flex: 1,
    width: "100%"
  }
});

export default UserProfile;
