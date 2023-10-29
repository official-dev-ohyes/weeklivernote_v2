import { StyleSheet, Image, View, Text } from "react-native";
import BodyInfo from "../components/AddInfo/BodyInfo";
import { tempChar } from "../assets";


function AddInfoScreen() {
  
  return (
    <View style={styles.mainContainer} >
      <Text>
        1단계
      </Text>
      <Image source={tempChar} style={styles.characterImage} />
      <BodyInfo />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer:{
    display: "flex",
    width: "90%",
    alignItems: 'center',
    marginRight: "auto",
    marginLeft: "auto",
  },
  characterImage:{
    width: "90%",
    height: 200,
    resizeMode: 'contain',
  }
});

export default AddInfoScreen;
