import { StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";
import { userNicknameAtom } from "../recoil/auth";

function MapScreen() {
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
