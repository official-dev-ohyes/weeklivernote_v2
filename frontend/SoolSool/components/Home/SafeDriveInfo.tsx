import { View, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

const SafeDriveInfo = () => {
  return (
    <View style={styles.chipsContainer}>
      <Chip mode="outlined" icon="blood-bag" style={styles.chip}>
        0.03 %
      </Chip>
      <Chip mode="outlined" icon="car-off" style={styles.chip}>
        08:30 까지
      </Chip>
    </View>
  );
};

const styles = StyleSheet.create({
  chipsContainer: {
    padding: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  chip: {
    marginHorizontal: 20,
    width: "40%",
  },
});

export default SafeDriveInfo;
