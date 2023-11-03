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
  navigation: any;
}

function Profile(props: UserProfileProps) {
  const { userData, navigation } = props;

  const handleEdit = () => {
    navigation.navigator("EditProfile");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userData.profileImg }}
          style={styles.profileImage}
        />
        <Pressable style={styles.editIcon} onPress={() => handleEdit}>
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
    backgroundColor: "#FFFF",
    flexDirection: "column",
    gap: 15,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0477BF",
    padding: 15,
    marginTop: 20,
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
    backgroundColor: "#0477BF",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 500,
    marginTop: 5,
    borderWidth: 2,
    borderColor: "#0477BF",
  },
  userDetail: {
    // flex: 1,
    width: "100%",
  },
  editIcon: {
    width: "auto",
    height: "auto",
    padding: 5,
    backgroundColor: "#0477BF",
    borderRadius: 50,
    position: "absolute",
    top: 98,
    right: 10,
  },
  profileContainer: {},
});

export default Profile;
