import { Text, View } from "react-native";
import React from "react";
import WeeklyStatistics from "../WeeklyStatistics";
import MonthlyStatistics from "../MonthlyStatistics";

interface UserStatisticsProps {
  // nonAlc:number;
}

function UserStatistics(props:UserStatisticsProps) {
    return (
      <View>
        <WeeklyStatistics/>
        <MonthlyStatistics/>
      </View>
    );
  }

export default UserStatistics;

