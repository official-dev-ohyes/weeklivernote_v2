import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

function DailyDetailScreen({ route }) {
  const { day } = route.params;
  return (
    <View>
      <Text>Daily Detail</Text>
      <Text>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default DailyDetailScreen;
