import { useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { IconButton } from "react-native-paper";

function DrinkController() {
  const [value, setValue] = useState(0);
  const minValue = 0;
  const maxValue = 99;
  const minIsDisabled = useMemo(() => value <= minValue, [minValue, value]);
  const maxIsDisabled = useMemo(() => value >= maxValue, [maxValue, value]);

  const handleDecrement = () => {
    // console.log("덜 마심");
    setValue((prev) => {
      return prev - 1;
    });
  };

  const handleIncrement = () => {
    // console.log("더 마심");
    setValue((prev) => {
      return prev + 1;
    });
  };

  return (
    <View>
      <View>
        <Text>혈중 알코올 농도</Text>
        <Text>운전 가능 시간</Text>
        <Text>주종 선택</Text>
      </View>
      <View style={styles.controllerContainer}>
        <IconButton icon="chevron-up" />
        <View style={styles.stepperContainer}>
          <IconButton
            icon="minus"
            onPress={handleDecrement}
            disabled={minIsDisabled}
          />
          <Text>{value}</Text>
          <IconButton
            icon="plus"
            onPress={handleIncrement}
            disabled={maxIsDisabled}
          />
        </View>
        <IconButton icon="chevron-down" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controllerContainer: {
    display: "flex",
    alignItems: "center",
    margin: 24,
    padding: 12,
    borderWidth: 2,
    borderColor: "black",
  },
  stepperContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default DrinkController;
