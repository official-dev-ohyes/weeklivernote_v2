import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { LCfirst } from "../../assets";

function LastChanceFirst({ navigation }) {
  const screenHeight = Dimensions.get("window").height;

  const goToHome = () => {
    console.log("여기는?");
    navigation.navigate("HomeRoute");
  };
  return (
    <ImageBackground
      source={LCfirst}
      style={[{ height: screenHeight }, styles.mainContainer]}
    >
      <View>
        <Text style={styles.text}>집까지 가는 막차를 알려드릴게요</Text>
      </View>
      <Button mode="contained" onPress={goToHome}>
        막차 조회하기
      </Button>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 100,
    paddingBottom: 100,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
});

export default LastChanceFirst;
