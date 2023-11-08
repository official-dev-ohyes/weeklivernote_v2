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
        <Text style={styles.periodContainer}>Drink Mindfully!</Text>
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
    padding: 0,
    display: "flex",
    alignItems: "center",
    marginTop: 100,
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
  },
  periodContainer: {
    fontSize: 24,
    fontFamily: "Yeongdeok-Sea",
    color: "white",
  },
  imageContainer: {},
  image: {
    width: 300,
    height: 300,
  },
});

export default DrinkingStatus;
