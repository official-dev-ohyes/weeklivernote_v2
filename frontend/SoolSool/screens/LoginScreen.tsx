import { TouchableOpacity, StyleSheet, Image, View } from "react-native";
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
      <Image source={logo} style={styles.logoImage} />
      <TouchableOpacity onPress={handleClick}>
        <Image source={kakaoLoginButton} style={styles.kakaoLoginButton} />
      </TouchableOpacity>
      <Button mode="contained" onPress={navigateToAddInfo}>
        추가 정보 입력
      </Button>
      <Button mode="contained" onPress={navigateToBottomTab}>
        메인으로
      </Button>
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
    height: 80,
    marginTop: 100,
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
});

export default LoginScreen;
