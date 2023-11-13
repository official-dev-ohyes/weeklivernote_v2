import { StyleSheet, Image, View, Dimensions, Text } from "react-native";
import BodyInfo from "../components/AddInfo/BodyInfo";
import { useState, useEffect, useRef } from "react";
import PagerView from "react-native-pager-view";
import AddInfoFirst from "../components/AddInfo/AddInfoFirst";
import AddInfoSecond from "../components/AddInfo/AddInfoSecond";
import AddInfoThird from "../components/AddInfo/AddInfoThird";

function AddInfoScreen({ navigation, route }) {
  const socialId = route?.params?.socialId;
  const pagerRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;

  const [address, setAddress] = useState("주소지 미입력");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [drinkCategory, setDrinkCategory] = useState("");
  const [drinkUnit, setDrinkUnit] = useState("");
  const [drinkAmount, setDrinkAmount] = useState(0);

  const drinkInfo = {
    category: drinkCategory,
    drinkUnit: drinkUnit,
    drinkAmount: drinkAmount,
  };

  const handlePage1ButtonClick = () => {
    pagerRef.current.setPage(1);
  };

  const handlePage2ButtonClick = () => {
    pagerRef.current.setPage(2);
  };

  const handlePage3ButtonClick = () => {
    pagerRef.current.setPage(3);
  };

  useEffect(() => {
    console.log("현재 성별은", gender);
    console.log("현재 체중은", weight);
    console.log("현재 신장은", height);
    console.log("현재 주소는", address);
    console.log("현재 주량은", drinkInfo);
    pagerRef.current = pagerRef.current || {};
  }, [address, gender, height, weight, drinkCategory, drinkUnit, drinkAmount]);

  return (
    <PagerView style={styles.pagerView} initialPage={0} ref={pagerRef}>
      <View key="1" style={[{ height: screenHeight }, styles.pageView]}>
        <AddInfoFirst
          gender={gender}
          setGender={setGender}
          height={height}
          setHeight={setHeight}
          weight={weight}
          setWeight={setWeight}
          onNextClick={handlePage1ButtonClick}
        />
      </View>
      <View key="2" style={[{ height: screenHeight }, styles.pageView]}>
        <AddInfoSecond
          address={address}
          setAddress={setAddress}
          onNextClick={handlePage2ButtonClick}
        />
      </View>
      <View key="3" style={[{ height: screenHeight }, styles.pageView]}>
        <AddInfoThird
          drinkCategory={drinkCategory}
          setDrinkCategory={setDrinkCategory}
          drinkUnit={drinkUnit}
          setDrinkUnit={setDrinkUnit}
          drinkAmount={drinkAmount}
          setDrinkAmount={setDrinkAmount}
          onNextClick={handlePage3ButtonClick}
        />
      </View>
      <View key="4" style={[{ height: screenHeight }, styles.pageView]}>
        {/* <AddInfoForth/> */}
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  pageView: {
    width: "100%",
    // backgroundColor: "red",
  },
});

// const styles = StyleSheet.create({
//   mainContainer: {
//     display: "flex",
//     width: "80%",
//     alignItems: "center",
//     marginRight: "auto",
//     marginLeft: "auto",
//     // backgroundColor: "#ffffff",
//     // flex: 1,
//     gap: 50,
//   },
//   characterImage: {
//     width: 300,
//     height: 190,
//     // resizeMode: "contain",
//   },
//   infoText: {
//     fontSize: 16,
//   },
// });

export default AddInfoScreen;
