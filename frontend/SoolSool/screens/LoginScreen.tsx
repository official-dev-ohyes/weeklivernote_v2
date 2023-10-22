import { StyleSheet, Text, View, Button } from "react-native";

function LoginScreen({ navigation }) {
  const navigateToAddInfo = () => {
    navigation.navigate("AddInfo");
  };
  const navigateToBottomTab = () => {
    navigation.navigate("BottomTab");
  };

  return (
    <View>
      <Text>Login</Text>
      <Button title="추가 정보 입력" onPress={navigateToAddInfo} />
      <Button title="메인으로" onPress={navigateToBottomTab} />
    </View>
  );
}

const styles = StyleSheet.create({});

export default LoginScreen;
