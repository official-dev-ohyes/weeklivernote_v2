import { StyleSheet, View } from "react-native";
import React from "react";
import WeeklyStatistics from "../WeeklyStatistics";
import MonthlyStatistics from "../MonthlyStatistics";

interface UserStatisticsProps {
  // nonAlc:number;
}

function UserStatistics(props:UserStatisticsProps) {
    return (
      <View style={styles.mainContainer}>
        <WeeklyStatistics/>
        <MonthlyStatistics/>
      </View>
    );
  }

  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: "column",
      gap: 15,
    },
  });

export default UserStatistics;

