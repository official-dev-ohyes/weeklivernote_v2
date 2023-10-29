import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';

function AddInfoStep3Screen({navigation}) {
  const goToPreviousStep = () => {
    navigation.navigate('AddInfoStep2');
  };
  return (
    <View>
      <Text>AddInfoStep3</Text>
      <Button mode="contained" onPress={goToPreviousStep}>
        Previous
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({});

export default AddInfoStep3Screen;
