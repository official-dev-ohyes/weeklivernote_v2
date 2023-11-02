import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchYearlyStatistics } from "../../api/statisticsApi";

interface MonthlyStatisticsProps {
  // nonAlc:number;
}

function MonthlyStatistics(props: MonthlyStatisticsProps) {
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);

  const {
    data: monthlyStatisticsData,
    isLoading: isLoading,
    isError: isError,
  } = useQuery(
    "monthlyStatisticsData",
    async () => await fetchYearlyStatistics()
  );

  useEffect(() => {
    if (!isLoading && monthlyStatisticsData) {
      setBarData(monthlyStatisticsData.weekly.bar);
      setLineData(monthlyStatisticsData.weekly.line);
    }
  }, [monthlyStatisticsData, isLoading]);

  return (
    <View style={styles.mainContainer}>
      <Text>연간 통계</Text>
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
              frontColor="#0477BF"
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
              color="#0477BF"
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
    gap: 10,
    borderRadius: 20,
  },
  graphBox: {
    width: "100%",
    height: 240,
    backgroundColor: "#F6F6F6",
    marginHorizontal: "auto",
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

export default MonthlyStatistics;
