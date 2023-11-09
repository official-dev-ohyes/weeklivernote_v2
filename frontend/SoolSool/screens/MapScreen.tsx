import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useEffect } from "react";

function MapScreen() {
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
    console.log("맵페이지들어옴");
  }, []);
  return (
    <View>
      <Text>현재 나의 위치</Text>
      <Text>위도:</Text>
      <Text>경도:</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default MapScreen;
