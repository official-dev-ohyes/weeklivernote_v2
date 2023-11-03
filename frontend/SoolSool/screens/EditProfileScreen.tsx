import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Divider, Provider } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "react-query";
import { fetchUserProfile } from "../api/mypageApi";

function EditProfileScreen() {
  const [nickname, setNickname] = useState("서이현");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDrinkKind, setSelectedDrinkKind] = useState(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("잔");

  const {
    data: userProfileData,
    isLoading,
    isError,
  } = useQuery("userProfileData", async () => await fetchUserProfile());

  useEffect(() => {
    if (!isLoading && userProfileData) {
      //디폴트값 전부 set함수에 넣어주기
    }
  }, []);

  const volumeUnits = ["잔", "병"];

  return (
    <Provider>
      <View style={styles.container}>
        <TextInput
          placeholder="닉네임"
          value={nickname}
          onChangeText={(text) => setNickname(text)}
        />
        <TextInput
          placeholder="성별"
          value={gender}
          onChangeText={(text) => setGender(text)}
        />
        <TextInput
          placeholder="신장"
          value={height}
          onChangeText={(text) => setHeight(text)}
        />
        <TextInput
          placeholder="체중"
          value={weight}
          onChangeText={(text) => setWeight(text)}
        />
        <TextInput
          placeholder="주량"
          value={amount.toString()}
          onChangeText={(text) => setAmount(parseFloat(text))}
        />
        <Picker
          selectedValue={unit}
          onValueChange={(itemValue, itemIndex) => setUnit(itemValue)}
        >
          <Picker.Item label="주량 단위 선택" value="" />
          {volumeUnits.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
        <TextInput
          placeholder="주소지"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Divider />
        <Button mode="contained" onPress={submitEditedProfile}>
          수정
        </Button>
        <Button mode="outlined" onPress={handleCancelEdit}>
          취소
        </Button>
      </View>
    </Provider>
  );
}

function submitEditedProfile() {
  // 프로필 수정 로직 구현
  // ...
}

function handleCancelEdit() {
  // 수정 취소 로직 구현
  // ...
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default EditProfileScreen;
