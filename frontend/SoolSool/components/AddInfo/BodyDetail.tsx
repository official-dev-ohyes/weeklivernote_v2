import { Text, View, StyleSheet } from "react-native";
import { Button, ProgressBar, MD3Colors } from "react-native-paper";
import React from "react";
import CustomSlider from "./CustomSlider";

// interface BodyDetailProps {
// nonAlc:number;
// }

function BodyDetail({ navigation, gender, socialId }) {
  // const navigation = useNavigation();
  console.log("여기까지는?", socialId);
  const [height, setHeight] = React.useState(0.5);
  const [weight, setWeight] = React.useState(0.5);

  const goToNextStep = () => {
    navigation.navigate("AddInfoStep2", {
      height: Math.round(height * 100),
      weight: Math.round(weight * 100),
      gender: gender,
      socialId: socialId,
    });
  };

  const handleWeightValueChange = (newValue) => {
    setWeight(newValue);
  };

  const handleHeightValueChange = (newValue) => {
    setHeight(newValue);
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>몸무게</Text>
      <View>
        <CustomSlider value={weight} onValueChange={handleWeightValueChange} />
        <Text>Progress: {Math.round(weight * 100)}kg</Text>
      </View>
      <Text style={styles.text}>키</Text>
      <View>
        <CustomSlider value={height} onValueChange={handleHeightValueChange} />
        <Text>Progress: {Math.round(height * 100)}cm</Text>
      </View>
      <Button mode="contained" onPress={goToNextStep}>
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: "#FFFF",
    flexDirection: "column",
    gap: 15,
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
  },
});

export default BodyDetail;
