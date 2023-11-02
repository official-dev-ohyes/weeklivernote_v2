import { View, StyleSheet, Text } from "react-native";
import { Chip, Icon, MD3Colors } from "react-native-paper";

const SafeDriveInfo = () => {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.chipsContainer}>
        <Icon source="blood-bag" color={MD3Colors.error50} size={32} />
        <Text style={styles.chipText}>0.03 %</Text>
      </View>
      <View style={styles.chipsContainer}>
        <Icon source="car-off" color={MD3Colors.error50} size={32} />
        <Text style={styles.chipText}> 08:30 까지</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chipsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "45%",
    padding: 12,
    borderRadius: 15,
    backgroundColor: "#F6F6F6",
  },
  chipText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default SafeDriveInfo;
