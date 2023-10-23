import { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import SettingsIconButton from "../components/MyPage/SettingsIconButton";

function MyPageScreen({ navigation }) {
  function handleHeaderButtonPressed() {
    navigation.navigate("Settings");
  }

  return (
    <View>
      <Text>My Page</Text>
      <SettingsIconButton onPress={handleHeaderButtonPressed} />
    </View>
  );
}

const styles = StyleSheet.create({});

export default MyPageScreen;
