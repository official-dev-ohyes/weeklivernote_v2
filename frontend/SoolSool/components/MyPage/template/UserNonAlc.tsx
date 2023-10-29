import { Text, View } from "react-native";
import React from "react";

interface UserNonAlcProps {
  nonAlc:number;
}

function UserNonAlc(props:UserNonAlcProps) {
  const nonAlc = props.nonAlc;
    return (
      <View>
        <Text>{nonAlc}</Text>
      </View>
    );
  }

export default UserNonAlc;
