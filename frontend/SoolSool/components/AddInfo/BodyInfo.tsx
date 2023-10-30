import { Text, View,StyleSheet,TouchableOpacity } from "react-native";
import React from "react";
import BodyDetail from "./BodyDetail";

interface BodyInfoProps {
  // nonAlc:number;
}

function BodyInfo(props:BodyInfoProps) {
    return (
      <View style={styles.mainContainer}>
        <Text>신체정보</Text>
        <View style={styles.columnContainer}>
        <Text>성별: </Text>
        <View  style={styles.rowContainer}>
        <TouchableOpacity style={styles.button}>
          <Text>female</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>male</Text>
        </TouchableOpacity>
        </View>
      </View>
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
    rowContainer:{
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-evenly"
    },
    columnContainer:{

    },
    button:{
      backgroundColor: 'lightgrey',
      padding: 20,
      borderRadius: 10,
      width: 120,
      display: "flex",
      alignItems: "center"
    }
  });
  
export default BodyInfo;

