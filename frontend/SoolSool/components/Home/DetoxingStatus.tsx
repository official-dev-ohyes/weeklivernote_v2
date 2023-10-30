import { StyleSheet, View, Text } from "react-native";
import Wave from "./Wave";

interface DetoxingStatusProps {
  alcoholInGrams: number;
  requiredTimeForDetox: number;
  detoxingFor: number;
}

function DetoxingStatus({
  alcoholInGrams,
  requiredTimeForDetox,
  detoxingFor,
}: DetoxingStatusProps) {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.titleContainer}>{alcoholInGrams}g</Text>
      <Text style={styles.subtitleContainer}>
        해독까지{"  "}
        <Text style={styles.periodContainer}>
          {requiredTimeForDetox - detoxingFor}
        </Text>
        시간
      </Text>
      <Wave />
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    width: "80%",
    marginVertical: 24,
    padding: 12,
    display: "flex",
    alignItems: "center",
  },
  titleContainer: {
    fontWeight: "bold",
    fontSize: 36,
  },
  subtitleContainer: {
    fontSize: 20,
    paddingBottom: 12,
  },
  periodContainer: {
    fontWeight: "bold",
  },
});

export default DetoxingStatus;
