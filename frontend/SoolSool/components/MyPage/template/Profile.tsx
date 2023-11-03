import { Text, Pressable, Image, StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
// import { cheeseDuck } from "../../../assets";
import DetailProfile from "../DetailProfile";

interface UserProfile {
  address: string;
  alcoholLimit: number;
  gender: string;
  height: number;
  nickname: string;
  profileImg: string | null;
  weight: number;
}

interface UserProfileProps {
  userData: UserProfile;
}

function Profile(props: UserProfileProps) {
  const { userData } = props;

  return (
    <View style={styles.mainContainer}>
      <Image
        source={{ uri: userData.profileImg }}
        style={styles.profileImage}
      />

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
    backgroundColor: "#FFFF",
    flexDirection: "column",
    gap: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  userInfoText: {
    fontSize: 17,
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
    backgroundColor: "#0477BF",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 500,
    marginTop: 40,
    borderWidth: 2,
    borderColor: "#0477BF",
  },
  userDetail: {
    // flex: 1,
    width: "100%",
  },
});

export default Profile;
