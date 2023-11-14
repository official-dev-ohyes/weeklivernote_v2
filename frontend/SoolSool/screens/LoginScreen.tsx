import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { characterSet, kakaoLoginButton, mainbackground } from "../assets";

function LoginScreen({ navigation }) {
  const handleLogin = () => {
    console.log("카카오버튼을 클릭했습니다");
    navigation.navigate("KakaoLoginScreen");
  };

  const screenHeight = Dimensions.get("window").height;

  return (
    <ImageBackground
      source={mainbackground}
      style={[{ height: screenHeight }, styles.background]}
    >
      <View style={styles.mainContainer}>
        <Image source={characterSet} style={styles.logoImage} />
        <View style={styles.shadow}></View>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>마신 술을 기록하고</Text>
            <Text style={styles.text}>내 상태를 확인해요</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogin}>
          <Image source={kakaoLoginButton} style={styles.kakaoLoginButton} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {},
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 70,
    height: "100%",
    // backgroundColor: "red",
  },
  shadow: {
    width: 100,
    height: 80,
    position: "absolute",
    top: 430,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    transform: [{ scaleX: 3 }],
    zIndex: 1,
  },
  kakaoLoginButton: {
    width: 280,
    height: 60,
    marginTop: 20,
    marginRight: "auto",
    marginLeft: "auto",
    borderRadius: 15,
  },
  logoImage: {
    position: "absolute",
    top: 280,
    width: 350,
    height: 220,
    marginRight: "auto",
    marginLeft: "auto",
    zIndex: 2,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 50,
    gap: 6,
  },
  text: {
    fontSize: 20,
    fontFamily: "LineRegular",
    color: "white",
  },
  temp: {
    display: "flex",
    flexDirection: "row",
  },
});

export default LoginScreen;
