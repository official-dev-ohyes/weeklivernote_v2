import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

function RecordCreateScreen({ route }) {
  const { day } = route.params;
  return (
    <View>
      <Text>Record Create</Text>
      <Text>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default RecordCreateScreen;
