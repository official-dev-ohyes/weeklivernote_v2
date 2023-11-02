import React, { useEffect, useState } from "react";
import DrinkingStatus from "./DrinkingStatus";
import DetoxingStatus from "./DetoxingStatus";
import { DrinkToday } from "../../models/DrinkToday";
import { calculateTimeDifference } from "../../utils/timeUtils";

interface UserStatusProps {
  identifier: string;
}

const UserStatus: React.FC<UserStatusProps> = ({ identifier }) => {
  const [drinkToday, setDrinkToday] = useState<DrinkToday | null>(null);
  const date = new Date("2023-11-01T15:30:00");

  useEffect(() => {
    setDrinkToday(
      new DrinkToday({
        drinkTotal: 1290,
        alcoholAmount: 35.8,
        drinkStartTime: date.toDateString(),
        height: 157,
        weight: 58,
        gender: "female",
      })
    );
  }, []);
  const timeSinceDrink = calculateTimeDifference(date);

  if (!drinkToday) {
    return;
  }

  return (
    <>
      {identifier === "0" && (
        <DrinkingStatus
          drinkInVolume={drinkToday.drinkTotal}
          drinkingFor={timeSinceDrink}
          imageSource={drinkToday.intoxicationImage}
        />
      )}
      {identifier === "1" && (
        <DetoxingStatus
          alcoholInGrams={drinkToday.alcoholAmount}
          requiredTimeForDetox={drinkToday.requiredTimeForDetox}
          detoxingFor={timeSinceDrink}
        />
      )}
    </>
  );
};

export default UserStatus;
