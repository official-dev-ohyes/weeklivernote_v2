import * as React from 'react';
import { View } from "react-native";
import { MD3Colors } from 'react-native-paper';

const CustomSlider = ({ value, onValueChange }) => {
  const handleDrag = (event) => {
    const totalWidth = 350; // 슬라이더의 전체 너비
    const newValue = event.nativeEvent.locationX / totalWidth;
    onValueChange(newValue);
  };

  return (
    <View
      style={{
        width: 350, // 슬라이더 너비
        height: 15, // 슬라이더 높이
        backgroundColor: 'lightgray',
        borderRadius: 10,
        overflow: 'hidden',
      }}
      onTouchMove={handleDrag}
    >
      <View
        style={{
          width: value * 350, // 프로그레스 값에 따른 너비
          height: 15,
          backgroundColor: MD3Colors.error70,
        }}
      />
    </View>
  );
};

export default CustomSlider;