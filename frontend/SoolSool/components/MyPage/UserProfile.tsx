import { Text, View } from "react-native";
import React from "react";

interface UserData {
  weight: number;
  gender: string;
  address: string;
  nickname: string;
  profileImage: string;
  alcoholAmount: number;
}

interface UserProfileProps {
  userData: UserData;
}

function UserProfile(props: UserProfileProps) {
  const { userData } = props;

  return (
    <View>
      <Text>UserProfile</Text>
    </View>
  );
}

export default UserProfile;
