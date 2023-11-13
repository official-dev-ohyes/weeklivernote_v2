import { StyleSheet, Dimensions, View } from "react-native";
import * as Location from "expo-location";
import { useEffect } from "react";

import PagerView from "react-native-pager-view";
import LastChanceFirst from "../components/LastChance/LastChanceFirst";
import LastChanceSecond from "../components/LastChance/LastChanceSecond";
import LastChanceThird from "../components/LastChance/LastChanceThird";

function LastChanceScreen({ navigation }) {
  const getLocation = async () => {
    try {
      // 위치 정보 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("위치 정보 권한이 거부되었습니다.");
        return;
      }

      // 위치 정보 가져오기
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      console.log("현재 위치 - 위도:", latitude, "경도:", longitude);
    } catch (error) {
      console.error("위치 정보를 가져오는 중 오류가 발생했습니다.", error);
    }
  };

  useEffect(() => {
    getLocation();
    console.log("막차 페이지에 들어왔습니다");
  }, []);

  const screenHeight = Dimensions.get("window").height;
  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View key="1" style={[{ height: screenHeight }, styles.pageView]}>
        <LastChanceFirst navigation={navigation} />
      </View>
      <View key="2" style={[{ height: screenHeight }, styles.pageView]}>
        <LastChanceSecond navigation={navigation} />
      </View>
      <View key="3" style={[{ height: screenHeight }, styles.pageView]}>
        <LastChanceThird navigation={navigation} />
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  pageView: {
    width: "100%",
    // backgroundColor: "red",
  },
});

export default LastChanceScreen;
