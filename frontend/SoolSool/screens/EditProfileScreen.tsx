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
  const [oldnickname, setOldNickname] = useState("");
  const [oldgender, setOldGender] = useState("");
  const [oldheight, setOldHeight] = useState("");
  const [oldweight, setOldWeight] = useState("");
  const [oldaddress, setOldAddress] = useState("");
  const [oldselectedDrinkKind, setOldSelectedDrinkKind] = useState("");
  const [oldamount, setOldAmount] = useState("");
  const [oldunit, setOldUnit] = useState("");
  const [oldimageURL, setOldImageURL] = useState("");

  const {
    data: userProfileData,
    isLoading,
    isError,
  } = useQuery("userProfileData", async () => await fetchUserProfile());

  useEffect(() => {
    console.log("ghgh", userProfileData);
    if (!isLoading && userProfileData) {
      setOldNickname(userProfileData.nickname);
      setOldGender(userProfileData.gender);
      setOldHeight(userProfileData.height);
      setOldWeight(userProfileData.weight);
      setOldAddress(userProfileData.address);
      setOldSelectedDrinkKind(userProfileData.drinkKind);
      setOldAmount(userProfileData.drinkInfo.drinkAmount);
      setOldUnit(userProfileData.drinkInfo.drinkUnit);
      setOldImageURL(userProfileData.profileImg);
    }
    // console.log("뭐야", oldheight);
  }, [isLoading, userProfileData]);

  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDrinkKind, setSelectedDrinkKind] = useState("소주");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("잔");
  const [imageURL, setImageURL] = useState("");

  const volumeUnits = ["잔", "병"];

  const handleCancelEdit = () => {
    navigation.navigate("MyPage");
  };

  const submitEditedProfile = async () => {
    if (weight || height) {
      if (
        parseInt(weight) < 30 ||
        parseInt(weight) > 200 ||
        parseInt(height) < 120 ||
        parseInt(height) > 220
      ) {
        Alert.alert("알림", "체중 및 신장 데이터가 적합하지 않습니다.");
        return;
      }
    }

    const drinkInfo = {
      category: selectedDrinkKind || oldselectedDrinkKind,
      drinkUnit: unit || oldunit,
      drinkAmount: amount || oldamount,
    };

    await updateUserProfile(
      nickname || oldnickname,
      weight || oldweight,
      height || oldheight,
      gender || oldgender,
      address || oldaddress,
      drinkInfo
    )
      .then((res) => {
        // console.log("업데이트 성공");
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
  };

  // useEffect(() => {
  //   console.log("??", amount);
  //   // console.log("뭐야", oldheight);
  // }, [amount]);

  return (
    <ScrollView>
      <Provider>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>회원정보수정</Text>
          <View style={styles.contentContainer}>
            {/* <ProfileImagePicker
              imageURL={oldimageURL}
              newImageURL={imageURL}
              setNewImageURL={setImageURL}
            /> */}
            <Text>닉네임</Text>
            <TextInput
              placeholder={oldnickname.toString()}
              value={nickname}
              style={styles.textInput}
              onChangeText={(text) => setNickname(text)}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text>성별</Text>
            <View style={styles.genderContainer}>
              <Button
                mode={gender === "남자" ? "contained" : "outlined"}
                onPress={() => setGender("남자")}
                style={styles.Button}
              >
                남자
              </Button>
              {/* 여자 버튼 */}
              <Button
                mode={gender === "여자" ? "contained" : "outlined"}
                onPress={() => setGender("여자")}
                style={styles.Button}
              >
                여자
              </Button>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text>신장</Text>
            <TextInput
              placeholder={oldheight.toString()}
              value={height}
              style={styles.textInput}
              onChangeText={(text) => setHeight(text)}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text>체중</Text>
            <TextInput
              placeholder={oldweight.toString()}
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
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedDrinkKind(itemValue)
                  }
                >
                  <Picker.Item label={"소주"} value={"소주"} />
                  <Picker.Item label={"맥주"} value={"맥주"} />
                </Picker>
              </View>
              <TextInput
                placeholder={oldamount.toString()}
                value={amount}
                style={styles.kindTextInput}
                onChangeText={(text) => setAmount(text)}
              />
              <View style={styles.Unit}>
                <Picker
                  selectedValue={unit}
                  mode="dropdown"
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
          <Button
            mode="contained"
            onPress={submitEditedProfile}
            buttonColor="#363C4B"
          >
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
    marginTop: 20,
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
  kindTextInput: {
    backgroundColor: "#F6F6F6",
    height: 50,
    borderRadius: 10,
    width: "20%",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  Kind: {
    width: 120,
  },
  title: {
    fontSize: 30,
  },
  Button: {
    flex: 1,
  },
});

export default EditProfileScreen;
