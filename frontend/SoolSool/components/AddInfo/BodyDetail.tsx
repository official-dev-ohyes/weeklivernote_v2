import { Text, View, StyleSheet,Alert  } from "react-native";
import { Button, ProgressBar, MD3Colors } from "react-native-paper";
import React from "react";
import CustomSlider from "./CustomSlider";

// interface BodyDetailProps {
// nonAlc:number;
// }

function BodyDetail({ navigation, gender, socialId }) {
  // const navigation = useNavigation();
  // console.log("여기까지는?", socialId);
  const [height, setHeight] = React.useState(0.5);
  const [weight, setWeight] = React.useState(0.5);

  const goToNextStep = () => {
    if (gender) {
      // gender가 null이 아니면 다음 단계로 이동
      navigation.navigate("AddInfoStep2", {
        height: Math.round(height * 100),
        weight: Math.round(weight * 100),
        gender: gender,
        socialId: socialId,
      });
    } else {
      Alert.alert("알림", "성별을 선택해주세요.");
    }
  };

  const handleWeightValueChange = (newValue) => {
    setWeight(newValue);
  };

  const handleHeightValueChange = (newValue) => {
    setHeight(newValue);
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>체중</Text>
      <View>
        <CustomSlider value={weight} onValueChange={handleWeightValueChange} />
        <Text>{Math.round(weight * 100)}kg</Text>
      </View>
      <Text style={styles.text}>키</Text>
      <View>
        <CustomSlider value={height} onValueChange={handleHeightValueChange} />
        <Text>{Math.round(height * 100)}cm</Text>
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
