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
  // console.log("d", userData);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.boldText}>성별</Text>
          <Text style={styles.text}>{userData.gender}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.boldText}>신장</Text>
          <Text style={styles.text}>{userData.height} cm</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.boldText}>체중</Text>
          <Text style={styles.text}>{userData.weight} kg</Text>
        </View>
      </View>

      <View style={styles.alcLimitContainer}>
        <Ionicons name="beer-outline" size={20} color={"white"} />
        <Text style={styles.boldText}>주량</Text>
        <Text style={styles.text}>{userData.alcoholLimit} ml</Text>
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
    // backgroundColor: "#363C4B",
    // borderRadius: 20,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  alcLimitContainer: {
    flex: 1,
    // backgroundColor: "#363C4B",
    borderRadius: 20,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 15,
    color: "black",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default DetailProfile;
