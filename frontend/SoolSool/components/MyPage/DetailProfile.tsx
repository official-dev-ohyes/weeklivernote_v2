import { Text, View, StyleSheet, Image } from "react-native";
import React from "react";

interface UserData {
  weight: number;
  gender: string;
  address: string;
  nickname: string;
  profileImage: string;
  alcoholAmount: number;
}

interface DetailProfileProps {
  userData: UserData;
}

function DetailProfile(props: DetailProfileProps) {
  const { userData } = props;

    return (
      <View style={styles.mainContainer}>
          <View >
            <Text>성별</Text>
            <Text>{userData.gender}</Text>
          </View>

          <View>
            <Text>체중</Text>
            <Text>{userData.weight} kg</Text>
          </View>

          <View>
            <Text>주량</Text>
            <Text>{userData.alcoholAmount} ml</Text>
          </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 20,
    },
  });

export default DetailProfile;
