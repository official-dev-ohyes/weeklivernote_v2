import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Text,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-paper";
import { characterSet, kakaoLoginButton, mainbackground } from "../assets";

function LoginScreen({ navigation }) {
  //테스트용 버튼에 필요한 함수들
  const navigateToAddInfo = () => {
    navigation.navigate("AddInfo");
  };
  const navigateToBottomTab = () => {
    navigation.navigate("BottomTab");
  };

  const handleLogin = () => {
    console.log("카카오버튼을 클릭했습니다");
    navigation.navigate("KakaoLoginScreen");
  };

  return (
    <ImageBackground source={mainbackground} style={styles.background}>
      <View style={styles.contentContainer}>
        <Image source={characterSet} style={styles.logoImage} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>마신 술을 기록하고</Text>
          <Text style={styles.text}>내 상태를 확인해요</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleLogin}>
        <Image source={kakaoLoginButton} style={styles.kakaoLoginButton} />
      </TouchableOpacity>
      {/* <View style={styles.temp}>
        <Button mode="contained" onPress={navigateToAddInfo}>
          추가 정보 입력
        </Button>
        <Button mode="contained" onPress={navigateToBottomTab}>
          메인으로
        </Button>
      </View> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "auto",
    gap: 30,
    height: "100%",
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
    width: 350,
    height: 220,
    marginRight: "auto",
    marginLeft: "auto",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 50,
  },
  text: {
    fontSize: 20,
    fontFamily: "Yeongdeok-Sea",
    color: "white",
  },
  temp: {
    display: "flex",
    flexDirection: "row",
  },
});

export default LoginScreen;
