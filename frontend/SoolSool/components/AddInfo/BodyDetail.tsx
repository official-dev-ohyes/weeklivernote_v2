import { Text, View,StyleSheet } from "react-native";
import { Button } from 'react-native-paper';
import React from "react";
import { useNavigation } from '@react-navigation/native';

interface BodyDetailProps {
  // nonAlc:number;
}

function BodyDetail(props:BodyDetailProps) {
  const navigation = useNavigation();
  
  const goToNextStep = () => {
    navigation.navigate('AddInfoStep2');
  };
    return (
      <View style={styles.mainContainer}>
        <Text>키몸무게정보</Text>
        {/* <View style={styles.tempBox}>

        </View> */}
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

