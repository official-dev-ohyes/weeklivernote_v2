import { Text, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface UserProfile {
  address: string;
  alcoholLimit: number;
  gender: string;
  height: number;
  nickname: string;
  profileImg: string | null;
  weight: number;
}

interface DetailProfileProps {
  userData: UserProfile;
}

function DetailProfile(props: DetailProfileProps) {
  const { userData } = props;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoContainer}>
        <Text>성별 {userData.gender}</Text>
        <Text>신장 {userData.height} cm</Text>
        <Text>체중 {userData.weight} kg</Text>
      </View>

      <View style={styles.alcLimitContainer}>
        <Ionicons name="beer-outline" size={20} />
        <Text>주량</Text>
        <Text>{userData.alcoholLimit} ml</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  infoContainer: {
    flex: 2,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  alcLimitContainer: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
});

export default DetailProfile;
