import { StyleSheet, Image, View, ScrollView, Text } from "react-native";
import BodyInfo from "../components/AddInfo/BodyInfo";
import { addInfoImage } from "../assets";
import DotIndicator from "../components/AddInfo/DotIndicator ";

function AddInfoScreen({ navigation, route }) {
  const socialId = route?.params?.socialId;
  console.log("소셜아이디", socialId);
  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <DotIndicator activeIndex={1} />
        <Text style={styles.infoText}>
          '주간일기'사용을 위해 정보를 입력해주세요🙂
        </Text>
        <Image source={addInfoImage} style={styles.characterImage} />
        <BodyInfo navigation={navigation} socialId={socialId} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "80%",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
    // backgroundColor: "#ffffff",
    // flex: 1,
    gap: 50,
  },
  characterImage: {
    width: 300,
    height: 190,
    // resizeMode: "contain",
  },
  infoText: {
    fontSize: 16,
  },
});

export default AddInfoScreen;
