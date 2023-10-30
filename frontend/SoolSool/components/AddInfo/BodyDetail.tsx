import { Text, View,StyleSheet } from "react-native";
import { Button, ProgressBar,MD3Colors  } from 'react-native-paper';
import React from "react";
import { useNavigation } from '@react-navigation/native';
import CustomSlider from "./CustomSlider";

interface BodyDetailProps {
  // nonAlc:number;
}

function BodyDetail(props:BodyDetailProps) {
  const navigation = useNavigation();
  const [height,setHeight] = React.useState(0.5);
  const [weight,setWeight] = React.useState(0.5);
  
  const goToNextStep = () => {
    navigation.navigate('AddInfoStep2');
  };

  const handleWeightValueChange = (newValue) => {
    setWeight(newValue);
  };

  const handleHeightValueChange = (newValue) => {
    setHeight(newValue);
  };

    return (
      <View style={styles.mainContainer}>
        <Text>몸무게</Text>
        <View>
          <CustomSlider value={weight} onValueChange={handleWeightValueChange} />
          <Text>Progress: {Math.round(weight * 100)}kg</Text>
        </View>
        <Text>키</Text>
        <View>
          <CustomSlider value={height} onValueChange={handleHeightValueChange} />
          <Text>Progress: {Math.round(height * 100)}cm</Text>
        </View>
          <Button mode="contained" onPress={goToNextStep}>
        Next
      </Button>
      
      </View>
    );
  }

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: "#FFFF",
      flexDirection: "column",
      gap: 5,
      borderRadius: 20,
    },
  });
  
export default BodyDetail;

