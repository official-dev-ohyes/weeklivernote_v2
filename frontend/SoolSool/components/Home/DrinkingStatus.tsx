import { StyleSheet, View, Text, Image } from "react-native";

interface DrinkingStatusProps {
  drinkInVolume: number;
  drinkingFor: number;
  imageSource: number;
}

function DrinkingStatus({
  drinkInVolume,
  drinkingFor,
  imageSource,
}: DrinkingStatusProps) {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.titleContainer}>{drinkInVolume}ml</Text>
      <Text style={styles.subtitleContainer}>
        마신 지{"  "}
        <Text style={styles.periodContainer}>{drinkingFor}</Text>
        시간 째
      </Text>
      <Image source={imageSource} />
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

export default DrinkingStatus;
