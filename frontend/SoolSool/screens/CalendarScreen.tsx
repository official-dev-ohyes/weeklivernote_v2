import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { CalendarList } from "react-native-calendars";

function CalendarScreen() {
  // Get the height and width of the smartphone screen
  const { height, width } = Dimensions.get("window");

  // // Calculate the number of weeks in the current month
  // const today = new Date();
  // // const today = new Date(2023, 7, 1);
  // const year = today.getFullYear();
  // const month = today.getMonth() + 1;

  // // Calculate the first and last day of the current month
  // const lastDay = new Date(year, month, 0).getDate();
  // const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  // const lastDayOfWeek = new Date(year, month - 1, lastDay).getDay();

  // // Calculate the number of weeks in the current month
  // let totalWeeks = 0;

  // for (let day = 1; day <= lastDay; day++) {
  //   if ((day + firstDayOfWeek - 1) % 7 === firstDayOfWeek) {
  //     console.log(`Days with the same weekday: ${day}th day`);
  //     totalWeeks += 1;
  //   }
  // }
  // if (lastDayOfWeek < firstDayOfWeek) {
  //   totalWeeks += 1;
  // }

  // console.log(`Today is: ${today}`);
  // console.log(`The first day of this month is: ${firstDayOfWeek}`);
  // console.log(`The last day of this month is: ${lastDayOfWeek}`);
  // console.log(`Total weeks in this month: ${totalWeeks} weeks!`);
  // const calendarHeight = height * 0.9;

  return (
    <View>
      <Text>Calendar</Text>
      {/* <View style={{ height: calendarHeight }}> */}
      <View style={{ height: height * 0.9 }}>
        <Calendar
          style={{ height: "100%" }}
          theme={{
            // Set the height of a calendar cell
            "stylesheet.day.basic": {
              base: {
                // Adjust cell height for 4/5/6 weeks
                // height: calendarHeight / (totalWeeks + 1), // temp
                height: height * 0.115,
              },
            },
          }}
        />

        {/* <CalendarList
          horizontal={true}
          pagingEnabled={true}
          style={{ height: "100%" }}
          theme={{
            arrowColor: "white",
            "stylesheet.calendar.header": {
              week: {
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              },
            },
            "stylesheet.day.basic": {
              container: {
                flex: 1,
                backgroundColor: "black",
              },
            },
          }}
        /> */}
      </View>
    </View>
  );
}

export default CalendarScreen;
