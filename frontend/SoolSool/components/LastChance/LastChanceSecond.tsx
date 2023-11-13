import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { LCsecond } from "../../assets";

function LastChanceSecond({ navigation }) {
  const screenHeight = Dimensions.get("window").height;

  const goToHome = () => {
    navigation.navigate("HomeRoute");
  };

  return (
    <ImageBackground
      source={LCsecond}
      style={[{ height: screenHeight }, styles.mainContainer]}
    >
      <View>{/* <Text>막차 첫번째 페이지 입니다</Text> */}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
  },
});

export default LastChanceSecond;
