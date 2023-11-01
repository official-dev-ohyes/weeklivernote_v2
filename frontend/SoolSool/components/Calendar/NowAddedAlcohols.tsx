import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

function NowAddedAlcohols({ alcoholRecord }) {
  useEffect(() => {
    for (let i = 0; i < alcoholRecord.length; i++) {
      console.log(`넘어온 정보${i + 1}번째!`);
      console.log("술 종류:", alcoholRecord[i].category);
      console.log("양:", alcoholRecord[i].amount);
      console.log("단위:", alcoholRecord[i].unit);
    }
  }, [alcoholRecord]);
  return (
    <View style={styles.total}>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
    // backgroundColor: "black",
  },
});

export default NowAddedAlcohols;
