import { Text, View,StyleSheet } from "react-native";
import React from "react";

interface MonthlyStatisticsProps {
  // nonAlc:number;
}

function MonthlyStatistics(props:MonthlyStatisticsProps) {
    return (
      <View style={styles.mainContainer}>
        <Text>월간통계페이지</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: "#FFFF",
      flexDirection: "column",
      gap: 5,
      borderRadius: 20,
    },
  });

export default MonthlyStatistics;

