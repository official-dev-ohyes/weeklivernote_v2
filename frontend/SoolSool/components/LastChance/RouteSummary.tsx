import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import RouteMotion from "./RouteMotion";

function RouteSummary({ info, subPath }) {
  const sectionTimeArr = subPath.map((path, index) => {
    // console.log("시간만 가져올게요", path.sectionTime);
    return {
      trafficType: path.trafficType,
      sectionTime: path.sectionTime,
    };
  });

  console.log("?", sectionTimeArr);
  const {
    totalWalk,
    totalTime,
    payment,
    firstStartStation,
    lastEndStation,
    busStationCount,
    subwayStationCount,
  } = info;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.title}>
        <Text>최단 경로</Text>
      </View>
      <View style={styles.summaryInfo}>
        <Text>도보 총{totalWalk}걸음</Text>
        <Text>소요시간 총 {totalTime}분</Text>
        <Text>{payment}원</Text>
        <Text>출발 {firstStartStation}</Text>
        <Text>도착 {lastEndStation}</Text>
        <Text>버스타고 {busStationCount}개 정류장</Text>
        <Text>지하철타고 {subwayStationCount}개 정류장</Text>
      </View>
      <View style={styles.routeGraph}>
        <RouteMotion sectionTimeArr={sectionTimeArr} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "lightgrey",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    display: "flex",
    flexDirection: "row",
  },
  summaryInfo: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  routeGraph: {
    display: "flex",
    flexDirection: "row",
  },
});

export default RouteSummary;
