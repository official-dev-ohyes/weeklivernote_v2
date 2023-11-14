import { StyleSheet, View, Image, Text, ImageProps } from "react-native";

interface DrinkingStatusProps {
  drinkInVolume: number;
  drinkingFor: number | undefined;
  imageSource: ImageProps["source"];
}

function DrinkingStatus({
  drinkInVolume,
  drinkingFor,
  imageSource,
}: DrinkingStatusProps) {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.titleContainer}>
        {drinkInVolume.toLocaleString()}ml
      </Text>
      {drinkingFor === undefined ? (
        <Text style={styles.subtitleContainer}>
          <Text style={styles.periodContainer}>
            술을 마셨다면 기록해볼까요?
          </Text>
        </Text>
      ) : (
        <Text style={styles.subtitleContainer}>
          마신 지{"  "}
          <Text style={styles.periodContainer}>{drinkingFor}</Text>
          시간 째
        </Text>
      )}

      <View style={styles.imageContainer}>
        <View style={styles.shadowContainer} />
        <Image source={imageSource} style={styles.image} />
      </View>
    </View>
  );
}

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
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  shadowContainer: {
    position: "absolute",
    top: 180,
    width: 150,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 50,
    transform: [{ scaleX: 2 }],
  },
  image: {
    position: "absolute",
    top: 0,
    width: 250,
    height: 250,
  },
});

export default DrinkingStatus;
