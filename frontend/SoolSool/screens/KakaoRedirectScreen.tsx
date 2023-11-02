import axios from "axios";
import { useEffect } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadingSpinner } from "../assets";

function KakaoRedirectScreen({ route, navigation }) {
  const { requestCode } = route.params;
  console.log("코드 잘들어오나?", requestCode);

  const fetchAccessToken = async (code: string) => {
    console.log("리다이렉트페이지에서 로그인 요청 보냄");
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

      console.log("리다이렉트 페이지에서 드디어 성공", response.data);

      if (response.data.message) {
        console.log("첫 회원이시군요!");
        navigation.navigate("AddInfo");
      } else {
        const accessToken = response.data.tokenInfo.accessToken;
        await AsyncStorage.setItem("accessToken", accessToken);
        navigation.navigate("BottomTab");
      }
    } catch (e) {
      console.log("리다이렉트 페이지에서 실패", e);
    }
  };

  useEffect(() => {
    fetchAccessToken(requestCode);
  }, [requestCode]);

  return (
    <View style={styles.mainContainer}>
      <Image source={loadingSpinner} style={styles.image} />
      <Text>잠시만 기다려주세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default KakaoRedirectScreen;
