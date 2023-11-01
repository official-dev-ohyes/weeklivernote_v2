import { StyleSheet, View, ImageBackground, Button } from "react-native";
import axios from "axios";
import { WebView } from "react-native-webview";

const RESTAPI_KEY = process.env.RESTAPI_KEY;
const REDIRECT_URI = "https://kauth.kakao.com/oauth/token";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

function KakaoLoginScreen({ navigation }) {
  // 백으로부터 AccessToken 및 유저데이터 받아오는 함수
  const fetchAccessToken = async (code: string) => {
    console.log(code, "로axios요청을 하는중...");
    try {
      const response = await axios.get(
        "https://soolsool.site/api/v1/user/login",
        {
          params: {
            code,
            grant_type: "authorization_code",
          },
        }
      );
      // const ACCESS_TOKEN = response.data.access_token;
      console.log("성공!", response.data);
      navigation.navigate("BottomTab");
    } catch (e) {
      console.log("실패", e);
    }
  };

  //url에서 인가코드를 파싱해오는 함수
  const getCode = (target: string) => {
    const exp = "code=";
    const condition = target.indexOf(exp);
    if (condition !== -1) {
      const requestCode = target.substring(condition + exp.length);
      console.log("url로부터 인가코드를 파싱중...");
      fetchAccessToken(requestCode);
    }
  };

  return (
    <View style={styles.backgroundImage}>
      <WebView
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${RESTAPI_KEY}&redirect_uri=${REDIRECT_URI}`,
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
