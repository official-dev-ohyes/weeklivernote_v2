import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

function BusRoute({ pathInfo }) {
  // console.log("버스는 어떻게 내려오나", pathInfo);
  const {
    distance, //오른쪽
    endID, //오른쪽
    endName, //오른쪽
    lane: [{ busNo }], //오른쪽
    passStopList: { stations },
    sectionTime, //왼쪽
    startID, //오른쪽
    startName, //오른쪽
    stationCount, //오른쪽
  } = pathInfo;

  // stations.map((station, index) => {
  //   console.log(`Station ${index + 1}:`, station);
  //   return null;
  // });

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
          <Text>{busNo}번 버스</Text>
          <Text>{distance}m</Text>
          <Text>{stationCount}개 정류장</Text>
          <Text>출발 정류장 {startName}</Text>
          <Text>{startID}</Text>
          <Text>도착 정류장 {endName}</Text>
          <Text>{endID}</Text>
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
    backgroundColor: "#6878FF",
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
    // backgroundColor: "black",
  },
  marginHorizonalContainer: {},
});

export default BusRoute;
