import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

function AlcoholChart({ drinks }) {
  console.log(drinks);
  console.log(drinks.length);
  console.log(typeof drinks);

  // 주종별 색상
  const categoryColors = {
    소주: "green",
    맥주: "yellow",
    와인: "red",
    소맥: "orange",
    "칵테일(약)": "pink",
    "칵테일(강)": "blue",
    막걸리: "white",
    위스키: "black",
  };

  return (
    <View style={styles.total}>
      <View style={styles.header}>
        <Text>음주 비율</Text>
      </View>
      <View style={styles.box}>
        <Text>음주량 비율</Text>
        <View style={styles.chart}>
          {Object.keys(drinks).map((key, index) => (
            <View
              key={index}
              style={{
                flex: drinks[key].drinkPercent,
                backgroundColor: categoryColors[drinks[key].category] || "gray",
              }}
            >
              <View style={styles.eachInfo}>
                <Text style={styles.infoText}>{drinks[key].category}</Text>
                <Text style={styles.infoText}>
                  {Math.round(drinks[key].drinkPercent)} %
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.box}>
        <Text>알코올양 비율</Text>
        <View style={styles.chart}>
          {Object.keys(drinks).map((key, index) => (
            <View
              key={index}
              style={{
                flex: drinks[key].alcPercent,
                backgroundColor: categoryColors[drinks[key].category] || "gray",
              }}
            >
              <View style={styles.eachInfo}>
                <Text style={styles.infoText}>{drinks[key].category}</Text>
                <Text style={styles.infoText}>
                  {Math.round(drinks[key].alcPercent)} %
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
  },
  header: {
    height: "20%",
  },
  box: {
    height: "35%",
    margin: "1%",
  },
  chart: {
    flexDirection: "row",
    height: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // 안드로이드에서 그림자 효과 추가
  },
  eachInfo: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: "3%",
  },
  infoText: {
    fontSize: 10,
  },
});

export default AlcoholChart;
