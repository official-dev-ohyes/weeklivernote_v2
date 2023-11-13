import React, { useState } from "react";
import { View, Image } from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { postImage } from "../../api/drinkRecordApi";

const CalendarImagePicker = (day) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        try {
          await postImage(day, result.assets[0].uri);
        } catch (error) {
          console.error("이미지 업로드 실패했어요ㅠ", error);
        }
      }
    } catch (error) {
      console.error("이미지 선택 실패", error);
    }
  };

  return (
    <View>
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 5,
            marginBottom: "5%",
          }}
        />
      )}
      <Button onPress={pickImage} mode="contained" buttonColor={"#363C4B"}>
        이미지 선택
      </Button>
    </View>
  );
};

export default CalendarImagePicker;
