import { TouchableOpacity, StyleSheet, Image, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { kakaoLoginButton, logo } from "../assets";

function LoginScreen({ navigation }) {
  const navigateToAddInfo = () => {
    navigation.navigate("AddInfo");
  };
  const navigateToBottomTab = () => {
    navigation.navigate("BottomTab");
  };
  const handleClick = () => {
    navigation.navigate("KakaoLoginScreen");
    console.log("카카오버튼을 클릭했습니다");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <Image source={logo} style={styles.logoImage} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>마신술을 기록하고</Text>
          <Text style={styles.text}>내 상태를 확인해요</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleClick}>
        <Image source={kakaoLoginButton} style={styles.kakaoLoginButton} />
      </TouchableOpacity>
      <View style={styles.temp}>
        <Button mode="contained" onPress={navigateToAddInfo}>
          추가 정보 입력
        </Button>
        <Button mode="contained" onPress={navigateToBottomTab}>
          메인으로
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "auto",
    gap: 30,
  },
  kakaoLoginButton: {
    width: 300,
    height: 70,
    marginTop: 20,
    marginRight: "auto",
    marginLeft: "auto",
    borderRadius: 15,
  },
  logoImage: {
    width: 350,
    height: 170,
    marginRight: "auto",
    marginLeft: "auto",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 80,
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    fontSize: 17,
  },
  temp: {
    display: "flex",
    flexDirection: "row",
  },
});

export default LoginScreen;
