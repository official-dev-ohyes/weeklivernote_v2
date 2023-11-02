import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { fetchStatistics } from "../../api/statisticsApi";
import { useState, useEffect } from "react";

interface WeeklyStatisticsProps {
  // nonAlc:number;
}

function WeeklyStatistics(props: WeeklyStatisticsProps) {
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  // let barData;

  useEffect(() => {
    fetchStatistics()
      .then((res) => {
        setBarData(res.weekly.bar);
        setLineData(res.weekly.line);
        // barData = res.weekly.bar;
        console.log("막대그래프 불러오기 성공", barData);
        console.log("선그래프 불러오기 성공", lineData);
      })
      .catch((error) => {
        console.error("실패", error);
      });
    console.log("데이터", barData);
  }, []);
  // const barData = [
  //   { value: 140 },
  //   { value: 50 },
  //   { value: 75 },
  //   { value: 20 },
  //   { value: 100 },
  //   { value: 25 },
  //   { value: 30 },
  // ];
  // const lineData = [
  //   { value: 95 },
  //   { value: 70 },
  //   { value: 110 },
  //   { value: 120 },
  //   { value: 85 },
  //   { value: 50 },
  // ];

  return (
    <View style={styles.mainContainer}>
      <Text>주간통계페이지</Text>
      <View style={styles.graphBox}>
        <View style={styles.chartContainer}>
          <View style={styles.barchart}>
            <BarChart
              data={barData}
              barWidth={15}
              height={180}
              barBorderRadius={5}
              stepValue={500}
              maxValue={2500}
              yAxisLabelWidth={0}
              hideAxesAndRules
            />
          </View>
          <View style={styles.linechart}>
            <LineChart
              data={lineData}
              // width={300}
              // height={150}
              yAxisThickness={0}
              xAxisThickness={0}
              stepValue={500}
              maxValue={300}
              yAxisLabelWidth={0}
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
  barchart: {
    position: "absolute",
    top: 0,
    right: 10,
    width: "100%",
    height: "100%",
  },
  linechart: {
    position: "absolute",
    bottom: 120,
    right: 10,
    width: "100%",
    height: "100%",
  },
});

export default WeeklyStatistics;
