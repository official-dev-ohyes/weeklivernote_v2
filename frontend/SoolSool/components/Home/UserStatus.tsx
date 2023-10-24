import { StyleSheet, View, Text, Image } from "react-native";

interface UserStatusProps {
  measurementUnit: "ml" | "g";
  amount: number;
  period: number;
}

function UserStatus({ measurementUnit, amount, period }: UserStatusProps) {
  if (measurementUnit === "ml") {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.titleContainer}>{amount}ml</Text>
        <Text style={styles.subtitleContainer}>
          마신 지{"  "}
          <Text style={styles.periodContainer}>{period}</Text>
          시간 째
        </Text>
        <Image source={require("../../assets/Home/drunken-level-01.png")} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusContainer: {
    width: "80%",
    marginVertical: 24,
    padding: 12,
    display: "flex",
    alignItems: "center",
  },
  titleContainer: {
    fontWeight: "bold",
    fontSize: 36,
  },
  subtitleContainer: {
    fontSize: 20,
  },
  periodContainer: {
    fontWeight: "bold",
  },
});

export default UserStatus;
