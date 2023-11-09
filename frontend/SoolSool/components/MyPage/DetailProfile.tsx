import { Text, View, StyleSheet } from "react-native";
import React from "react";

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

interface DetailProfileProps {
  userData: UserProfile;
}

function DetailProfile(props: DetailProfileProps) {
  const { userData } = props;
  // console.log("d", userData.drinkInfo?.drinkAmount);
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
        <Text style={styles.boldText}>주량</Text>
        <Text style={styles.text}>{userData?.drinkInfo?.category}</Text>
        <Text style={styles.text}>
          {userData?.drinkInfo?.drinkAmount} {userData?.drinkInfo?.drinkUnit}
        </Text>
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
    // alignItems: "center",
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
