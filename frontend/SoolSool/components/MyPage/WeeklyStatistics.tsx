import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { BarChart, LineChart } from "react-native-gifted-charts";

interface WeeklyStatisticsProps {
  // nonAlc:number;
}

function WeeklyStatistics(props: WeeklyStatisticsProps) {
  const barData = [
    { value: 140 },
    { value: 50 },
    { value: 75 },
    { value: 20 },
    { value: 100 },
    { value: 25 },
    { value: 30 },
  ];
  const lineData = [
    { value: 95 },
    { value: 70 },
    { value: 110 },
    { value: 120 },
    { value: 85 },
    { value: 50 },
  ];

  return (
    <View style={styles.mainContainer}>
      <Text>주간통계페이지</Text>
      <View style={styles.graphBox}>
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            <BarChart
              data={barData}
              barWidth={15}
              height={180}
              barBorderRadius={5}
              stepValue={15}
              maxValue={150}
              yAxisLabelWidth={30}
            />
          </View>
          <View style={styles.chart}>
            <LineChart
              data={lineData}
              // width={300}
              // height={150}
              yAxisThickness={0}
              xAxisThickness={0}
              stepValue={15}
              hideAxesAndRules
            />
          </View>
        </View>
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
  graphBox: {
    width: 350,
    height: 235,
    backgroundColor: "#0477BF",
    marginHorizontal: 10,
    borderRadius: 20,
  },
  chartContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    margin: 20,
  },
  chart: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

export default WeeklyStatistics;
