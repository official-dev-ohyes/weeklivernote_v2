import { StyleSheet, View, Text, Image, ImageProps } from "react-native";

interface DrinkingStatusProps {
  drinkInVolume: number;
  drinkingFor: number;
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
      <Text style={styles.subtitleContainer}>
        마신 지{"  "}
        <Text style={styles.periodContainer}>{drinkingFor}</Text>
        시간 째
      </Text>
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
  imageContainer: {
    backgroundColor: "#F6F6F6",
    borderRadius: 200,
    marginVertical: 24,
    padding: 8,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    margin: 30,
  },
});

export default DrinkingStatus;
