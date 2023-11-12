import { StyleSheet, View, Text } from "react-native";
import Wave from "./Wave";

interface DetoxingStatusProps {
  alcoholInGrams: number;
  requiredTimeForDetox: number;
  detoxingFor: number | undefined;
}

function DetoxingStatus({
  alcoholInGrams,
  requiredTimeForDetox,
  detoxingFor,
}: DetoxingStatusProps) {
  const detoxingInProgress =
    requiredTimeForDetox !== 0
      ? (1 - detoxingFor / requiredTimeForDetox) * 100
      : 0;

  const remainingTime = requiredTimeForDetox - detoxingFor;

  const AdjustedRemainingTime = () => {
    if (remainingTime > 0) {
      return (
        <Text style={styles.subtitleContainer}>
          해독까지{"  "}
          <Text style={styles.periodContainer}>{remainingTime.toFixed(1)}</Text>
          시간
        </Text>
      );
    } else {
      return (
        <Text style={styles.subtitleContainer}>
          <Text style={styles.periodContainer}>간 상태가 아주 깨끗해요!</Text>
        </Text>
      );
    }
  };

  return (
    <View style={styles.statusContainer}>
      <Text style={styles.titleContainer}>
        {alcoholInGrams.toLocaleString()}g
      </Text>
      {detoxingFor === undefined ? (
        <Text style={styles.subtitleContainer}>
          <Text style={styles.periodContainer}>간 상태가 아주 깨끗해요!</Text>
        </Text>
      ) : (
        <AdjustedRemainingTime />
      )}

      <Wave size={200} progress={detoxingInProgress} />
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    width: "80%",
    marginVertical: 24,
    padding: 4,
    display: "flex",
    alignItems: "center",
    marginTop: 55,
  },
  titleContainer: {
    fontSize: 40,
    fontFamily: "Yeongdeok-Sea",
    color: "white",
  },
  subtitleContainer: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
    color: "white",
    marginBottom: 20,
  },
  periodContainer: {
    fontSize: 24,
    fontFamily: "Yeongdeok-Sea",
    color: "white",
  },
});

export default DetoxingStatus;
