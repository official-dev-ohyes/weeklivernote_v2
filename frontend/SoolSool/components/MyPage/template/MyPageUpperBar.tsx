import { Text, View, StyleSheet } from "react-native";
import React from "react";
import SettingsIconButton from "../SettingsIconButton";

function MyPageUpperBar() {
  function handleHeaderButtonPressed() {
    // navigation.navigate("Settings");
    // navigation을 프롭스로 받아와야하나?
  }

  return (
    <View style={styles.upperBar}>
      <View style={styles.title}>
        <Text>MyPage</Text>
      </View>
      <View style={styles.settingsIcon}>
        <SettingsIconButton onPress={handleHeaderButtonPressed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  upperBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {
    flex: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  settingsIcon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default MyPageUpperBar;
