import { Text, View,StyleSheet } from "react-native";
import React from "react";

interface WeeklyStatisticsProps {
  // nonAlc:number;
}

function WeeklyStatistics(props:WeeklyStatisticsProps) {
    return (
      <View style={styles.mainContainer}>
        <Text>주간통계페이지</Text>
        <View style={styles.tempBox}>

        </View>
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
    tempBox:{
      width: "90%",
      height: 100,
      backgroundColor: "lightgrey",
      marginHorizontal: 10,
      borderRadius: 20
    }
  });
  
export default WeeklyStatistics;

