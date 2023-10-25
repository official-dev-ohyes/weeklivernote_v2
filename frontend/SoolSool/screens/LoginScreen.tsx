import { StyleSheet, Text, ImageBackground, Button } from "react-native";
import { Back_bright_2, kakaoLoginButton } from "../assets";
import { WebView } from "react-native-webview";
import { useState } from "react";

const CLIENT_ID = "24e024b40fae60991200f1a8475bdd5f";
const REDIRECT_URI = "https://soolsool.life/oauth";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

function LoginScreen({ navigation }) {
  const [url, setUrl] = useState("");

  const navigateToAddInfo = () => {
    navigation.navigate("AddInfo");
  };
  const navigateToBottomTab = () => {
    navigation.navigate("BottomTab");
  };

  // const getCode = (target: string) => {
  //   const exp = "code=";
  //   const condition = target.indexOf(exp);
  //   if (condition !== -1) {
  //     const requestCode = target.substring(condition + exp.length);
  //     // requestToken(requestCode);
  //   }
  // };

  return (
    <ImageBackground source={Back_bright_2} style={styles.backgroundImage}>
      <Text>Login</Text>
      <WebView
        originWhitelist={["*"]}
        scalesPageToFit={false}
        style={{ marginTop: 30 }}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled={true}
        onMessage={(event) => {
          const data = event.nativeEvent.url;
          setUrl(data);
        }}
      />
      <Button title="추가 정보 입력" onPress={navigateToAddInfo} />
      <Button title="메인으로" onPress={navigateToBottomTab} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
});

export default LoginScreen;
