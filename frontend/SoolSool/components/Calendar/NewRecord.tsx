import { StyleSheet, Text, View } from "react-native";

function NewRecord({}) {
  return <View style={styles.check}></View>;
}

const styles = StyleSheet.create({
  check: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
  },
});

export default NewRecord;
