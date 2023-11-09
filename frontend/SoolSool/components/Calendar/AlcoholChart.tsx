import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

function AlcoholChart({ info }) {
  return (
    <View style={styles.total}>
      <Text>{info.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  total: {
    flex: 1,
  },
});

export default AlcoholChart;
