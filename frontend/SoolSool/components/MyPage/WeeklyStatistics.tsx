import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { BarChart, LineChart } from "react-native-gifted-charts";

interface WeeklyStatisticsProps {
  // nonAlc:number;
}

function WeeklyStatistics(props: WeeklyStatisticsProps) {
  const barData = [
    { value: -250 },
    { value: -500 },
    { value: -745 },
    { value: -320 },
    { value: -600 },
    { value: -256 },
    { value: -300 },
  ];
  const lineData = [
    { value: -5 },
    { value: -10 },
    { value: -15 },
    { value: -20 },
    { value: -25 },
  ];

  return (
    <View style={styles.mainContainer}>
      <Text>주간통계페이지</Text>
      <View style={styles.tempBox}>
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            <BarChart
              data={barData}
              barWidth={20}
              height={180}
              maxValue={0}
              barBorderRadius={5}
              isAnimated
              frontColor={"tomato"}
            />
          </View>
          <View style={styles.chart}>
            <LineChart
              data={lineData}
              // width={300}
              // height={150}
              yAxisThickness={0}
              xAxisThickness={0}
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
  tempBox: {
    width: 350,
    height: 200,
    backgroundColor: "lightgrey",
    marginHorizontal: 10,
    borderRadius: 20,
  },
  chartContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
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
