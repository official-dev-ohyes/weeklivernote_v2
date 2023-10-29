import { Text, View,StyleSheet } from "react-native";
import { Button, ProgressBar,MD3Colors  } from 'react-native-paper';
import React from "react";
import { useNavigation } from '@react-navigation/native';

interface BodyDetailProps {
  // nonAlc:number;
}

function BodyDetail(props:BodyDetailProps) {
  const navigation = useNavigation();
  const [progress, setProgress] = React.useState(0.5);

  const increaseProgress = () => {
    if (progress < 1) {
      setProgress(progress + 0.1);
    }
  };

  const decreaseProgress = () => {
    if (progress > 0) {
      setProgress(progress - 0.1);
    }
  };
  
  const goToNextStep = () => {
    navigation.navigate('AddInfoStep2');
  };
    return (
      <View style={styles.mainContainer}>
        <Text>키몸무게정보</Text>
        <ProgressBar progress={progress} color={MD3Colors.error50} />
        <Text>Progress: {Math.round(progress * 100)}%</Text>
        <Button onPress={increaseProgress}>Increase Progress</Button>
        <Button onPress={decreaseProgress}>Decrease Progress</Button>
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

