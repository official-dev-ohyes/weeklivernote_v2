import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Button, Divider, Provider } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "react-query";
import { fetchUserProfile, updateUserProfile } from "../api/mypageApi";
import Toast from "react-native-root-toast";
import { showErrorAndRetry } from "../utils/showErrorUtils";

function EditProfileScreen({ navigation }) {
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDrinkKind, setSelectedDrinkKind] = useState("소주");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("잔");

  const {
    data: userProfileData,
    isLoading,
    isError,
  } = useQuery("userProfileData", async () => await fetchUserProfile());

  useEffect(() => {
    if (!isLoading && userProfileData) {
      setHeight(userProfileData.height);
      setWeight(userProfileData.weight);
      setAddress(userProfileData.address);
      setNickname(userProfileData.nickname);
      setSelectedGender(userProfileData.gender);
    }
  }, [isLoading, userProfileData]);

  const volumeUnits = ["잔", "병"];

  const handleCancelEdit = () => {
    navigation.navigate("MyPage");
  };

  const submitEditedProfile = async () => {
    if (
      !nickname ||
      !selectedGender ||
      !height ||
      !weight ||
      !address ||
      !selectedDrinkKind ||
      !amount ||
      !unit
    ) {
      // 하나라도 null 또는 빈 문자열이면 알림을 표시합니다.
      Alert.alert("알림", "모든 항목을 선택해주세요.");
    } else {
      const drinkInfo = {
        category: selectedDrinkKind,
        drinkUnit: unit,
        drinkAmount: amount,
      };

      await updateUserProfile(
        nickname,
        weight,
        height,
        gender,
        address,
        drinkInfo
      )
        .then((res) => {
          console.log("업데이트 성공");
          Toast.show("프로필 수정 성공", {
            duration: Toast.durations.SHORT,
            position: 0,
            shadow: true,
            animation: true,
            opacity: 0.8,
          });
          navigation.navigate("MyPage");
        })
        .catch((error) => {
          console.error("정보 수정 실패", error);
          showErrorAndRetry(
            "다음에 다시 시도하세요",
            "알 수 없는 오류가 발생했습니다. 나중에 다시 시도하세요."
          );
        });
    }
  };

  useEffect(() => {
    // console.log("Nickname changed:", nickname);
    // console.log("Selected Gender changed:", selectedGender);
    // console.log("Height changed:", height);
    // console.log("Weight changed:", weight);
    // console.log("Address changed:", address);
    // console.log("Selected Drink Kind changed:", selectedDrinkKind);
    // console.log("Amount changed:", amount);
    // console.log("Unit changed:", unit);
  }, [
    nickname,
    selectedGender,
    height,
    weight,
    address,
    selectedDrinkKind,
    amount,
    unit,
  ]);

  return (
    <ScrollView>
      <Provider>
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <Text>닉네임</Text>
            <TextInput
              placeholder="닉네임"
              value={nickname}
              style={styles.textInput}
              onChangeText={(text) => setNickname(text)}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text>성별</Text>
            <View style={styles.genderContainer}>
              <Button
                mode={selectedGender === "남자" ? "contained" : "outlined"}
                onPress={() => setSelectedGender("남자")}
              >
                남자
              </Button>
              {/* 여자 버튼 */}
              <Button
                mode={selectedGender === "여자" ? "contained" : "outlined"}
                onPress={() => setSelectedGender("여자")}
              >
                여자
              </Button>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text>신장</Text>
            <TextInput
              placeholder="신장"
              value={height}
              style={styles.textInput}
              onChangeText={(text) => setHeight(text)}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text>체중</Text>
            <TextInput
              placeholder="체중"
              value={weight}
              style={styles.textInput}
              onChangeText={(text) => setWeight(text)}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text>주량</Text>
            <View style={styles.alcLimitContainer}>
              <View style={styles.Kind}>
                <Picker
                  selectedValue={selectedDrinkKind}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedDrinkKind(itemValue)
                  }
                >
                  <Picker.Item label={"소주"} value={"소주"} />
                  <Picker.Item label={"맥주"} value={"맥주"} />
                </Picker>
              </View>
              <TextInput
                placeholder="주량"
                value={amount}
                style={styles.textInput}
                onChangeText={(text) => setAmount(text)}
              />
              <View style={styles.Unit}>
                <Picker
                  selectedValue={unit}
                  onValueChange={(itemValue, itemIndex) => setUnit(itemValue)}
                >
                  {/* <Picker.Item label="주량 단위 선택" value="" /> */}
                  {volumeUnits.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text>주소</Text>
            <TextInput
              placeholder="주소지"
              value={address}
              style={styles.textInput}
              onChangeText={(text) => setAddress(text)}
            />
          </View>
          <Divider />
          <Button mode="contained" onPress={submitEditedProfile}>
            수정
          </Button>
          <Button mode="outlined" onPress={handleCancelEdit}>
            취소
          </Button>
        </View>
      </Provider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    gap: 15,
  },
  genderContainer: {
    display: "flex",
    flexDirection: "row",
    // borderWidth: 2,
    // borderColor: "red",
  },
  alcLimitContainer: {
    // borderWidth: 2,
    // borderColor: "red",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Unit: {
    // borderWidth: 2,
    // borderColor: "blue",
    width: 120,
  },
  textInput: {
    backgroundColor: "#F6F6F6",
    height: 50,
    borderRadius: 10,
    // width: "100%",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  Kind: {
    width: 120,
  },
});

export default EditProfileScreen;
