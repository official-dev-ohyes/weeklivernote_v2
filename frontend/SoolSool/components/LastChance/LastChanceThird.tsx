import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { LCthird } from "../../assets";

function LastChanceThird({ navigation }) {
  const screenHeight = Dimensions.get("window").height;

  const goToHome = () => {
    navigation.navigate("HomeRoute");
  };
  return (
    <ImageBackground
      source={LCthird}
      style={[{ height: screenHeight }, styles.mainContainer]}
    >
      <View style={styles.lastChanceContainer}>
        <Text style={styles.text}>집까지 가는 막차를 알려드릴게요</Text>
        <Button
          mode="contained"
          buttonColor="black"
          textColor="white"
          labelStyle={styles.button}
          rippleColor={"white"}
          loading={true}
          onPress={goToHome}
        >
          귀가 경로 조회하기
        </Button>
      </View>
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
  lastChanceContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    gap: 10,
    marginRight: "auto",
    marginLeft: "auto",
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
  },
  button: {
    fontSize: 15,
  },
});

export default LastChanceThird;
