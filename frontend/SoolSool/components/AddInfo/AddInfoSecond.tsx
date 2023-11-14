import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-paper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Toast from "react-native-root-toast";
import { mainbackground } from "../../assets";

function AddInfoSecond({ address, setAddress, onNextClick }) {
  const autoCompleteHandler = (data, details = null) => {
    // data는 검색결과에 대한 간략한 정보
    // details는 검색결과에 대한 자세한 값 예) 평점, 사진, 주소 등등
    // console.log("여기뭐가들어오는거지", data, details);
    // 실행할 함수
    // ex) setPlace(data.블라블라)
  };
  console.log("내 구글 api key...", process.env.GOOGLE_API_KEY);

  const screenHeight = Dimensions.get("window").height;
  return (
    <ImageBackground
      source={mainbackground}
      style={[{ height: screenHeight }, styles.mainContainer]}
    >
      <View style={styles.subContainer}>
        <View style={styles.nextTime}>
          <Text style={styles.text}>추후 주소 정보를 입력 받습니다.</Text>
          <Text style={styles.text}>다음 단계로 이동해주세요.</Text>
        </View>
        <Button
          mode="contained"
          onPress={onNextClick}
          textColor={"black"}
          buttonColor={"#FFDE68"}
        >
          다음 단계로 가기
        </Button>
        {/* <PlacesInput
      googleApiKey={process.env.GOOGLE_API_KEY}
      onSelect={(address) => setSelectedAddress(address)}
      placeholder="주소 검색"
    /> */}
        {/* <GooglePlacesAutocomplete
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
          // backgroundColor: "red",
          flexDirection: "row",
        },
        textInput: {
          backgroundColor: "lightblue",
          borderRadius: 50,
          height: 44,
          fontSize: 16,
          paddingVertical: 9,
          paddingHorizontal: 12,
        },
        predefinedPlacesDescription: {
          color: "#1faadb",
        },
        listView: {
          backgroundColor: "lightblue",
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
          backgroundColor: "red",
        },
        description: {
          fontSize: 15,
        },
        loader: {
          flexDirection: "row",
          justifyContent: "flex-end",
          height: 20,
        },
      }}
    /> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  subContainer: {
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    gap: 50,
    // marginTop: 130,
    justifyContent: "center",
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "green",
  },
  text: {
    fontSize: 20,
    color: "white",
    fontFamily: "LineRegular",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  nextTime: {
    display: "flex",
    alignItems: "center",
    // textAlign: "center",
  },
});

export default AddInfoSecond;
