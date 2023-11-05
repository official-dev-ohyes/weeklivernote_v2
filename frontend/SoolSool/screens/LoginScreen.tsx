import { TouchableOpacity, StyleSheet, Image, View, Text } from "react-native";
import { Button } from "react-native-paper";
import { kakaoLoginButton, logo } from "../assets";
import { WebView } from "react-native-webview";
import {useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const RESTAPI_KEY = process.env.RESTAPI_KEY;
const REDIRECT_URI = "https://soolsool.site/kakao/callback";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

function LoginScreen({ navigation }) {
  const [showWebView, setShowWebView] = useState(false);

  const navigateToAddInfo = () => {
    navigation.navigate("AddInfo");
  };
  const navigateToBottomTab = () => {
    navigation.navigate("BottomTab");
  };
  const handleLogin = () => {
    console.log("카카오버튼을 클릭했습니다");
    // navigation.navigate("KakaoLoginScreen");
    setShowWebView(true);
  };

  const fetchAccessToken = async (code: string) => {
    console.log("이렇게되면 fetchAccessToken 요청 성공");
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACK_URL+"/v1/user/login",
        {
          params: {
            code,
            grant_type: "authorization_code",
          },
        }
      );

      console.log("로그인에 성공했습니다");

      if (response.data.message) {
        const socialId = response.data.socialId;
        console.log("첫 회원이시군요!", response.data.socialId);
        console.log("혹시모르니까 확인!", response.data);
        navigation.navigate("AddInfo", { socialId: socialId });
      } else {
        console.log("이미 가입된 회원이니까 메인 화면으로");
        const accessToken = response.data.tokenInfo.accessToken;
        await AsyncStorage.setItem("accessToken", accessToken);
        navigation.navigate("BottomTab");
      }
    } catch (e) {
      console.log("리다이렉트 페이지에서 실패", e);
    }
  };

  //url에서 인가코드를 파싱해오는 함수
  // const getCode = (target: string) => {
  //   const exp = "code=";
  //   const condition = target.indexOf(exp);
  //   if (condition !== -1) {
  //     const requestCode = target.substring(condition + exp.length);
  //     console.log("url로부터 인가코드를 파싱중...");
  //     // fetchAccessToken(requestCode);
  //     console.log("파싱잘되었나?", requestCode);
  //     // URL 리다이렉트 처리를 위해 "Redirect" 화면으로 이동
  //     navigation.navigate("KakaoRedirectScreen", { requestCode: requestCode });
  //   }
  // };

  const handleShouldStartLoad = (event: any) => {
    const url = event.url;
    // url에 붙어오는 code= 가있다면 뒤부터 parse하여 인가 코드 get
    const exp = "code=";
    const searchIdx = url.indexOf(exp);
    if (searchIdx !== -1) {
      const code = url.substring(searchIdx + exp.length);
      console.log("인가 코드", code);
      fetchAccessToken(code);
      return false;
    }
    return true;
  };


  if(showWebView){
    // console.log("웹뷰띄우는데까지는 성공")
    return (
      <WebView
      originWhitelist={["*"]}
      scalesPageToFit={false}
      source={{
        uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${RESTAPI_KEY}&redirect_uri=${REDIRECT_URI}`,
      }}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      javaScriptEnabled={true}
      // onMessage={(event) => {
      //   const data = event.nativeEvent.url;
      //   getCode(data);
      // }}
      onShouldStartLoadWithRequest={handleShouldStartLoad}
    />
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <Image source={logo} style={styles.logoImage} />
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
    // backgroundColor: "#ffffff",
    // flex: 1,
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
