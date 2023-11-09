import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { BarChart, LineChart } from "react-native-gifted-charts";
import {
  // fetchStatistics,
  fetchWeeklyStatistics,
} from "../../api/statisticsApi";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

interface WeeklyStatisticsProps {
  // nonAlc:number;
}

function WeeklyStatistics(props: WeeklyStatisticsProps) {
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);

  const {
    data: weeklyStatisticsData,
    isLoading: isLoading,
    isError: isError,
  } = useQuery(
    "weeklyStatisticsData",
    async () => await fetchWeeklyStatistics()
  );

  useEffect(() => {
    if (!isLoading && weeklyStatisticsData) {
      setBarData(weeklyStatisticsData.weekly.bar);
      setLineData(weeklyStatisticsData.weekly.line);
    }
  }, [weeklyStatisticsData, isLoading]);

  return (
    <View style={styles.mainContainer}>
      <Text>주간 통계</Text>
      <View style={styles.graphBox}>
        <View style={styles.chartContainer}>
          <View style={styles.barchart}>
            <BarChart
              data={barData}
              barWidth={29}
              height={180}
              barBorderRadius={5}
              stepValue={500}
              maxValue={2500}
              initialSpacing={0}
              yAxisLabelWidth={7}
              hideAxesAndRules
              frontColor="#FFCC4A"
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
              color="#363C4B"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: "#FFFF",
    flexDirection: "column",
    gap: 10,
    borderRadius: 20,
  },
  graphBox: {
    width: "100%",
    height: 240,
    backgroundColor: "white",
    marginHorizontal: "auto",
    borderRadius: 20,
    // 그림자 추가 (Android 및 iOS 모두에서 동작)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // 안드로이드에서 그림자 효과 추가
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
