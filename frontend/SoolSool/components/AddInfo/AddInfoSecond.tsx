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
import { mainbackground } from "../../assets";
import AddressSearch from "./AddressSearch";
import { ScrollView } from "react-native-gesture-handler";

function AddInfoSecond({ address, setAddress, onNextClick }) {
  const screenHeight = Dimensions.get("window").height;
  return (
    <ImageBackground
      source={mainbackground}
      style={[{ height: screenHeight }, styles.mainContainer]}
    >
      <ScrollView>
        <View style={styles.subContainer}>
          <View style={styles.questionContainer}>
            <Text style={styles.titleText}>술자리 후</Text>
            <Text style={styles.titleText}>어디로 길을 안내해드릴까요?</Text>
          </View>
          <View style={styles.AddressContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.AddressText}>{address}</Text>
              <Text style={styles.text}>으로 갈래요!</Text>
            </View>
            <AddressSearch setAddress={setAddress} />
          </View>
          <Button
            mode="contained"
            buttonColor={"#FFDE68"}
            textColor={"#000000"}
            onPress={onNextClick}
          >
            다음 단계로 가기
          </Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
  },
  subContainer: {
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    gap: 40,
    marginTop: 90,
    justifyContent: "center",
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: "green",
  },
  text: {
    fontSize: 16,
    color: "white",
    fontFamily: "LineRegular",
  },
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  AddressText: {
    fontSize: 16,
    color: "yellow",
    fontFamily: "LineRegular",
  },
  titleText: {
    fontSize: 28,
    color: "white",
    fontFamily: "LineRegular",
    textAlign: "center",
  },
  AddressContainer: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    gap: 10,
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
  },
});

export default AddInfoSecond;
