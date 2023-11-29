import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Text,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import { characterSet, kakaoLoginButton, mainbackground } from "../assets";
import AppleLoginButton from "../components/Login/AppleLoginButton";
// import * as SecureStore from "expo-secure-store";

function LoginScreen({ navigation }) {
  const screenHeight = Dimensions.get("window").height;

  const handleLogin = () => {
    console.log("카카오버튼을 클릭했습니다");
    navigation.navigate("KakaoLoginScreen");
  };

  return (
    <ImageBackground
      source={mainbackground}
      style={[{ height: screenHeight }, styles.background]}
    >
      <View style={styles.mainContainer}>
        <View style={styles.ImageContainer}>
          <Image source={characterSet} style={styles.logoImage} />
          <View style={styles.shadow}></View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>마신 술을 기록하고</Text>
          <Text style={styles.text}>내 상태를 확인해요</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin}>
            <Image source={kakaoLoginButton} style={styles.kakaoLoginButton} />
          </TouchableOpacity>
          {Platform.OS === "ios" && <AppleLoginButton />}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {},
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    height: "100%",
  },
  ImageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
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
    position: "relative",
    width: 350,
    height: 220,
    marginRight: "auto",
    marginLeft: "auto",
    zIndex: 2,
  },
  shadow: {
    width: 100,
    height: 80,
    position: "relative",
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.3)",
    transform: [{ scaleX: 3 }],
    zIndex: 1,
    marginTop: -70,
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
