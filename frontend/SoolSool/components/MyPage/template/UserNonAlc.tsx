import { Text, View,StyleSheet, Image } from "react-native";
import React from "react";
import { cheeseDuck, nonAlcIcon } from "../../../assets";

interface UserNonAlcProps {
  nonAlc:number;
}

function UserNonAlc(props:UserNonAlcProps) {
  const nonAlc = props.nonAlc;
    return (
      <View style={styles.mainContainer}>
        <Image source={nonAlcIcon} style={styles.mainIcon} />
        <Text style={styles.commonText}>술을 </Text>
        <Text style={styles.boldText}>{nonAlc}</Text>
        <Text style={styles.commonText} >일간 마시지 않았습니다:)</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: "#FFFF",
      flexDirection: "row",
      gap: 5,
      borderRadius: 20,
    },
    mainIcon :{
    width: 50,
    height: 50,
    borderWidth: 2,
    // borderColor: "lightgray",
    },
    boldText:{
      fontWeight: "bold",
      fontSize: 30,
      alignSelf: "center", // 수직 가운데 정렬
    },
    commonText:{
      alignSelf: "center", // 수직 가운데 정렬
    }
  });

export default UserNonAlc;
