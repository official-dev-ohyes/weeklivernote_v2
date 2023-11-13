import { StyleSheet, View, Text } from "react-native";
import Wave from "./Wave";
import { calculateTimeDifference, getTodayAt5 } from "../../utils/timeUtils";

interface DetoxingStatusProps {
  alcoholInGrams: number;
  requiredTimeForDetox: number;
  detoxingFor: number | undefined;
  additionalTimeForDetox: number;
}

const DetoxingStatus = ({
  alcoholInGrams,
  requiredTimeForDetox,
  detoxingFor,
  additionalTimeForDetox,
}: DetoxingStatusProps) => {
  let detoxingInProgress: number;

  if (additionalTimeForDetox === 0) {
    detoxingInProgress =
      requiredTimeForDetox !== 0
        ? (1 - detoxingFor / requiredTimeForDetox) * 100
        : 0;
  } else {
    const timeSince5 = calculateTimeDifference(new Date(getTodayAt5()));
    if (requiredTimeForDetox === 0) {
      detoxingInProgress = (1 - timeSince5 / additionalTimeForDetox) * 100;
    } else {
      const weight1 = 1 - detoxingFor / requiredTimeForDetox;
      const weight2 = 1 - timeSince5 / additionalTimeForDetox;

      detoxingInProgress = ((weight1 + weight2) / 2) * 100;
    }
  }

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
};

const styles = StyleSheet.create({
  statusContainer: {
    width: "80%",
    marginTop: "15%",
    marginVertical: 24,
    padding: 4,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  titleContainer: {
    fontSize: 40,
    fontFamily: "LineRegular",
    color: "white",
  },
  subtitleContainer: {
    fontSize: 20,
    fontFamily: "LineRegular",
    color: "white",
    marginBottom: 20,
  },
  periodContainer: {
    fontSize: 24,
    fontFamily: "LineRegular",
    color: "white",
  },
});

export default DetoxingStatus;
