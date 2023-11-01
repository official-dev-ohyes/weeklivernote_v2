import { StyleSheet, Image, View, Text } from "react-native";
import BodyInfo from "../components/AddInfo/BodyInfo";
import { addInfoImage } from "../assets";
import DotIndicator from "../components/AddInfo/DotIndicator ";

function AddInfoScreen({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      <DotIndicator activeIndex={1} />
      <Image source={addInfoImage} style={styles.characterImage} />
      <BodyInfo navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "80%",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
    gap: 15,
  },
  characterImage: {
    width: "90%",
    height: 200,
    resizeMode: "contain",
  },
});

export default AddInfoScreen;
