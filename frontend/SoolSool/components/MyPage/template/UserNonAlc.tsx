import { Text, View, StyleSheet } from "react-native";
import React from "react";

interface AlcoholStatistics {
  maxNonAlcPeriod: number;
  nowNonAlcPeriod: number;
  drinkYearAmount: number;
}

interface UserNonAlcProps {
  alcoholData: AlcoholStatistics;
}

function UserNonAlc(props: UserNonAlcProps) {
  const { alcoholData } = props;
  return (
    <View style={styles.mainContainer}>
      <View style={styles.circleContainer}>
        <Text style={styles.stringText}>최근금주지속</Text>
        <Text style={styles.numberText}>{alcoholData.nowNonAlcPeriod}</Text>
      </View>
      <View style={styles.circleContainer}>
        <Text style={styles.stringText}>최장금주지속</Text>
        <Text style={styles.numberText}>{alcoholData.maxNonAlcPeriod}</Text>
      </View>
      <View style={styles.circleContainer}>
        <Text style={styles.stringText}>올해음주량</Text>
        <Text style={styles.numberText}>{alcoholData.drinkYearAmount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    gap: 40,
  },
  circleContainer: {
    flexDirection: "column",
    flex: 1,
    width: 70,
    height: 100,
    backgroundColor: "lightblue",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
  },
  stringText: {
    fontSize: 17,
  },
  numberText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default UserNonAlc;
