import { StyleSheet, View, ImageBackground, Button } from "react-native";
import axios from "axios";
import { WebView } from "react-native-webview";

const CLIENT_ID = process.env.REACT_APP_API_KEY;
const REDIRECT_URI = "https://kauth.kakao.com/oauth/token";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

function KakaoLoginScreen({ navigation }) {
  //백으로부터 AccessToken 및 유저데이터 받아오는 함수
  const fetchAccessToken = async (code: string) => {
    try {
      const response = await axios.get("/api/v1/user/login", {
        params: {
          code,
          grant_type: "authorization_code",
        },
      });
      const ACCESS_TOKEN = response.data.access_token;
      console.log("accessToken이 잘 들어왔나?", ACCESS_TOKEN);
    } catch (e) {
      console.log("accessToken을 받아오는데 실패했습니다", e);
    }
  };

  //url에서 인가코드를 파싱해오는 함수
  const getCode = (target: string) => {
    const exp = "code=";
    const condition = target.indexOf(exp);
    if (condition !== -1) {
      const requestCode = target.substring(condition + exp.length);
      console.log("여기에 뭐가 담길까?", requestCode);
      fetchAccessToken(requestCode);
    }
  };

  return (
    <View style={styles.backgroundImage}>
      <WebView
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled={true}
        onMessage={(event) => {
          const data = event.nativeEvent.url;
          getCode(data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
});

export default KakaoLoginScreen;
