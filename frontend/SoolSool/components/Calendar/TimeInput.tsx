import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function TimeInput({
  selectedHour,
  selectedMinute,
  selectedAmPm,
  show,
  setShow,
  date,
  onChange,
}) {
  return (
    <>
      <TouchableOpacity onPress={setShow} style={styles.timeInput}>
        <Text style={styles.timeInnerText}>
          {selectedHour} : {selectedMinute} {selectedAmPm}
        </Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"time"}
            is24Hour={false}
            display="spinner"
            onChange={onChange}
          />
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  timeInput: {
    flexDirection: "row",
    backgroundColor: "#f6f6f6",
    width: "50%",
    alignItems: "center",
    borderRadius: 5,
    flex: 2,
  },
  timeInnerText: {
    flex: 1,
    textAlign: "center",
  },
});

export default TimeInput;
