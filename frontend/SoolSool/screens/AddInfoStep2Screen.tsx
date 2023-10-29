import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';

function AddInfoStep2Screen({navigation}) {
  const goToNextStep = () => {
    navigation.navigate('AddInfoStep3');
  };

  const goToPreviousStep = () => {
    navigation.navigate('AddInfo');
  };
  return (
    <View>
      <Text>AddInfoStep2Screen</Text>
      <Button mode="contained" onPress={goToPreviousStep}>
        Previous
      </Button>
      <Button mode="contained" onPress={goToNextStep}>
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({});

export default AddInfoStep2Screen;