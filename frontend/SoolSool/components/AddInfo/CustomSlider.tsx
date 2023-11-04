import * as React from "react";
import { View } from "react-native";
import { MD3Colors } from "react-native-paper";

const CustomSlider = ({ value, onValueChange }) => {
  const totalWidth = 200; // 슬라이더의 전체 너비

  const handleDrag = (event) => {
    const newValue = event.nativeEvent.locationX / totalWidth;
    onValueChange(newValue);
  };

  return (
    <View
      style={{
        width: 350,
        height: 15,
        backgroundColor: "lightgray",
        borderRadius: 10,
        overflow: "hidden",
      }}
      onTouchMove={handleDrag}
    >
      <View
        style={{
          width: value * 200, // 프로그레스 값에 따른 너비
          height: 15,
          backgroundColor: "#25368E",
        }}
      />
    </View>
  );
};

export default CustomSlider;
