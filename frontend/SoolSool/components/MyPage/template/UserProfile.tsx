import { Text, Pressable, Image, StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { cheeseDuck } from "../../../assets";

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
      <View style={styles.userProfileBox}>
        <View style={styles.LeftBox}>
          <Image source={cheeseDuck} style={styles.profileImage} />
          <View style={styles.userInfoContainerRow}>
            <Text style={styles.userInfoLabel}>닉네임:</Text>
            <Text style={styles.userInfoText}>{userData.nickname}</Text>
          </View>

          <View style={styles.userInfoContainerRow}>
            <Text style={styles.userInfoLabel}>성별:</Text>
            <Ionicons name="female-outline" size={15} />
          </View>
        </View>

        <View style={styles.RightBox}>
          <View style={styles.rightBoxItem}>
            <Text style={styles.userInfoLabel}>주소</Text>
            <Text style={styles.userInfoText}>{userData.address}</Text>
          </View>

          <View style={styles.rightBoxItem}>
            <Text style={styles.userInfoLabel}>체중</Text>
            <Text style={styles.userInfoText}>{userData.weight} kg</Text>
          </View>

          <View style={styles.rightBoxItem}>
            <Text style={styles.userInfoLabel}>주량</Text>
            <Text style={styles.userInfoText}>{userData.alcoholAmount} ml</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: "#FFFF",
  },
  userProfileBox: {
    // backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
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
  userInfoContainerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 500,
    marginTop: 30,
    borderWidth: 2,
    borderColor: "lightgray",
  },
  RightBox: {
    flexDirection: "row",
    gap: 5,
  },
  rightBoxItem: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderRadius: 10,
    padding: 5,
  },
  LeftBox: {},
});

export default UserProfile;
