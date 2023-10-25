import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

interface UserStatusProps {
  measurementUnit: "ml" | "g";
  amount: number;
  period: number;
  imageSource: number;
}

function UserStatus({
  measurementUnit,
  amount,
  period,
  imageSource,
}: UserStatusProps) {
  if (measurementUnit === "ml") {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.titleContainer}>{amount}ml</Text>
        <Text style={styles.subtitleContainer}>
          마신 지{"  "}
          <Text style={styles.periodContainer}>{period}</Text>
          시간 째
        </Text>
        <Image source={imageSource} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusContainer: {
    width: "80%",
    marginVertical: 24,
    padding: 12,
    display: "flex",
    alignItems: "center",
  },
  titleContainer: {
    fontWeight: "bold",
    fontSize: 36,
  },
  subtitleContainer: {
    fontSize: 20,
  },
  periodContainer: {
    fontWeight: "bold",
  },
});

export default UserStatus;
