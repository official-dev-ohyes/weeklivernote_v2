import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

function SubwayRoute({ pathInfo }) {
  console.log("지하철은 어떻게 내려오나", pathInfo);
  const {
    distance,
    endExitNo,
    endName,
    lane: { name },
    passStopList: { stations },
    sectionTime, //왼쪽
    startExitNo,
    startName,
    stationCount,
    way,
    wayCode,
  } = pathInfo;
  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.leftmarginContainer}>
          <Text>{sectionTime}분</Text>
        </View>
      </View>
      <View
        style={[styles.routhGraphContainer, { height: sectionTime * 20 }]}
      ></View>
      <View style={styles.rightContainer}>
        <View style={styles.rightmarginContainer}>
          <Text>{name}</Text>
          <Text>{way}가는 지하철</Text>
          <Text>{wayCode}호선</Text>
          <Text>{distance}m</Text>
          <Text>{stationCount}개 정류장</Text>
          <Text>출발지 {startExitNo}번 출구</Text>
          <Text>도착지 {endExitNo}번 출구</Text>
          <Text>출발역 {startName}역</Text>
          <Text>도착역 {endName}역</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    // backgroundColor: "blue",
    display: "flex",
    flexDirection: "row",
  },
  leftContainer: {
    width: "20%",
    // backgroundColor: "red",
    display: "flex",
    justifyContent: "center",
  },
  routhGraphContainer: {
    width: "5%",
    height: 100,
    backgroundColor: "brown",
  },
  rightContainer: {
    width: "75%",
    // backgroundColor: "green",
  },
  leftmarginContainer: {
    height: "auto",
    marginRight: "auto",
    marginLeft: "auto",
    // backgroundColor: "black",
  },
  rightmarginContainer: {
    width: "95%",
    height: "auto",
    marginRight: "auto",
    marginLeft: "auto",
    // display: "flex",
    // justifyContent: "center",
    // backgroundColor: "black",
  },
  marginHorizonalContainer: {},
});

export default SubwayRoute;
