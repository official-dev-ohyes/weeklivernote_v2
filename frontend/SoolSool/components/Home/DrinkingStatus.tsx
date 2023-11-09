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
      <Text style={styles.titleContainer}>{drinkInVolume}ml</Text>
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
        <Image source={imageSource} style={styles.image} />
      </View>
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
    marginTop: 50,
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
  imageContainer: {
    width: 190,
    height: 190,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 500,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default DrinkingStatus;
