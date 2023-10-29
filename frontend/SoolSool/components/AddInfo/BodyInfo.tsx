import { Text, View,StyleSheet } from "react-native";
import React from "react";
import BodyDetail from "./BodyDetail";

interface BodyInfoProps {
  // nonAlc:number;
}

function BodyInfo(props:BodyInfoProps) {
    return (
      <View style={styles.mainContainer}>
        <Text>신체정보페이지</Text>
        {/* <View style={styles.tempBox}>

        </View> */}
        <BodyDetail />
      </View>
    );
  }

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: "#FFFF",
      flexDirection: "column",
      gap: 5,
      borderRadius: 20,
    },
  });
  
export default BodyInfo;

