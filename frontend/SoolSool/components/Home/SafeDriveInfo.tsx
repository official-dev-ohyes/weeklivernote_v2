import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Icon, MD3Colors } from "react-native-paper";
import { calculateTimeAfterHours } from "../../utils/timeUtils";

interface SafeDriveInfoProps {
  bloodAlcoholContent: number;
  drinkStartTime: string;
  requiredTimeToDrive: number;
}

const SafeDriveInfo: React.FC<SafeDriveInfoProps> = ({
  bloodAlcoholContent,
  drinkStartTime,
  requiredTimeToDrive,
}) => {
  const canDriveFrom = calculateTimeAfterHours(
    drinkStartTime,
    requiredTimeToDrive
  );

  return (
    <View style={styles.rootContainer}>
      <View style={styles.chipsContainer}>
        <Icon source="blood-bag" color={MD3Colors.error50} size={32} />
        <Text style={styles.chipText}>{bloodAlcoholContent} %</Text>
      </View>
      <View style={styles.chipsContainer}>
        {canDriveFrom === "passed" ? (
          <>
            <Icon source="car" color="#6A9C89" size={32} />
            <Text style={styles.chipText}>안전 운전</Text>
          </>
        ) : (
          <>
            <Icon source="car-off" color={MD3Colors.error50} size={32} />
            <Text style={styles.chipText}>{canDriveFrom} 까지</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chipsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "45%",
    padding: 12,
    borderRadius: 15,
    backgroundColor: "#F6F6F6",
  },
  chipText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SafeDriveInfo;
