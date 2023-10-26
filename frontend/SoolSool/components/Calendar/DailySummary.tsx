import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

function DailySummary({ summaryText }) {
  console.log(`summary text는? ${summaryText}`);
  return (
    <View style={styles.check}>
      <Text>{summaryText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  check: {
    flex: 1,
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 10,
    padding: 5,
  },
});

export default DailySummary;
