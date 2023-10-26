import { StyleSheet, View, Text } from "react-native";

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
      <Text>간 찰랑찰랑 이미지 자리</Text>
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
  },
  periodContainer: {
    fontWeight: "bold",
  },
});

export default DetoxingStatus;
