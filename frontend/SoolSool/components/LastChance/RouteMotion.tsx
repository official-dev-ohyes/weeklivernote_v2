import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";

const RouteMotion = ({ sectionTimeArr }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      { iterations: -1 }
    ).start();
  }, [animatedValue]);

  const renderBars = () => {
    return sectionTimeArr.map((section, index) => {
      const barColor =
        section.trafficType === 1
          ? "orange"
          : section.trafficType === 2
          ? "blue"
          : "gray";

      return (
        <View key={index} style={styles.barContainer}>
          <View style={[styles.bar, { backgroundColor: barColor }]} />
          <Animated.View
            style={[
              styles.pointer,
              {
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100], // 0%부터 100%까지의 범위로 변경
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.motionContainer}>{renderBars()}</View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "brown",
  },
  motionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  barContainer: {
    marginRight: 10,
    position: "relative",
  },
  bar: {
    height: 10,
    width: 100,
  },
  pointer: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 10,
    top: -5,
    left: 0,
  },
});

export default RouteMotion;
