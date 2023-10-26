import React from "react";
import { View } from "react-native";
import DrinkingStatus from "./DrinkingStatus";
import DetoxingStatus from "./DetoxingStatus";

interface UserStatusProps {
  index: number;
  drinkInVolume: number;
  alcoholInGrams: number;
  requiredTimeForDetox: number;
  period: number;
  imageSource: number;
}

const UserStatus: React.FC<UserStatusProps> = ({
  index,
  drinkInVolume,
  alcoholInGrams,
  requiredTimeForDetox,
  period,
  imageSource,
}) => {
  return (
    <>
      {index === 0 && (
        <DrinkingStatus
          drinkInVolume={drinkInVolume}
          drinkingFor={period}
          imageSource={imageSource}
        />
      )}
      {index === 1 && (
        <DetoxingStatus
          alcoholInGrams={alcoholInGrams}
          requiredTimeForDetox={requiredTimeForDetox}
          detoxingFor={period}
        />
      )}
    </>
  );
};

export default UserStatus;
