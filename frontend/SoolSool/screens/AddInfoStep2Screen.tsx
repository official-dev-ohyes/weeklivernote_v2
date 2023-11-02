import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DotIndicator from "../components/AddInfo/DotIndicator ";
import { useRoute } from "@react-navigation/native";

function AddInfoStep2Screen({ navigation, route }) {
  const height = route.params.height;
  const weight = route.params.weight;
  const gender = route.params.gender;

  console.log("!키:", height);
  console.log("!몸무게:", weight);
  console.log("!성별:", gender);

  const [selectedAddress, setSelectedAddress] = useState("삼성전기");

  const autoCompleteHandler = (data, details = null) => {
    // data는 검색결과에 대한 간략한 정보
    // details는 검색결과에 대한 자세한 값 예) 평점, 사진, 주소 등등
    console.log("여기뭐가들어오는거지", data, details);
    // 실행할 함수
    // ex) setPlace(data.블라블라)
  };

  const goToNextStep = () => {
    if (selectedAddress) {
      navigation.navigate("AddInfoStep3", {
        address: selectedAddress,
        height: height,
        weight: weight,
        gender: gender,
      });
    } else {
      alert("주소를 선택해주세요");
    }
  };

  const goToPreviousStep = () => {
    navigation.navigate("AddInfo");
  };
  console.log("내 구글 api key...", process.env.GOOGLE_API_KEY);

  useEffect(() => {
    console.log("주소가들어오나?", selectedAddress);
  }, [selectedAddress]);
  return (
    <View style={styles.mainContainer}>
      <DotIndicator activeIndex={2} />
      <Text>주소를 선택하세요</Text>
      {/* <PlacesInput
        googleApiKey={process.env.GOOGLE_API_KEY}
        onSelect={(address) => setSelectedAddress(address)}
        placeholder="주소 검색"
      /> */}
      <GooglePlacesAutocomplete
        placeholder="여기에 주소를 검색하세요"
        minLength={2}
        keyboardShouldPersistTaps={"handled"}
        fetchDetails={true}
        onPress={autoCompleteHandler}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
        keepResultsAfterBlur={true}
        query={{
          key: process.env.GOOGLE_API_KEY,
          language: "ko",
          components: "country:kr",
        }}
        enablePoweredByContainer={false}
        styles={{
          textInputContainer: {
            backgroundColor: "grey",
            flexDirection: "row",
          },
          textInput: {
            height: 38,
            color: "#5d5d5d",
            fontSize: 16,
            paddingVertical: 9,
            paddingHorizontal: 12,
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
          listView: {
            backgroundColor: "#ffffff",
            borderRadius: 10,
            paddingHorizontal: 10,
            elevation: 8,
            shadowColor: "#6164BB",
          },
          row: {
            paddingVertical: 20,
          },
          separator: {
            height: 2,
            backgroundColor: "#c8c7cc",
          },
          description: {
            fontSize: 15,
            fontFamily: "spoqaR",
          },
          loader: {
            flexDirection: "row",
            justifyContent: "flex-end",
            height: 20,
          },
        }}
      />
      <Button mode="contained" onPress={goToPreviousStep}>
        Previous
      </Button>
      <Button mode="contained" onPress={goToNextStep}>
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",s
  },
});

export default AddInfoStep2Screen;
