import {
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Button,
} from "react-native";
import { Back_bright_2, kakaoLoginButton } from "../assets";

function LoginScreen({ navigation }) {
  console.log("와",navigation);
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
    <ImageBackground source={Back_bright_2} style={styles.backgroundImage}>
      <TouchableOpacity onPress={handleClick}>
        <Image source={kakaoLoginButton} style={styles.kakaoLoginButton} />
      </TouchableOpacity>
      <Button title="추가 정보 입력" onPress={navigateToAddInfo} />
      <Button title="메인으로" onPress={navigateToBottomTab} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  kakaoLoginButton: {
    width: 300,
    height: 80,
    marginRight: "auto",
    marginLeft: "auto",
    borderRadius: 15,
  },
});

export default LoginScreen;
