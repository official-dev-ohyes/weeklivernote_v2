import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SettingsIconButton({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Ionicons name="settings" size={24} color="black" />
    </Pressable>
  );
}

export default SettingsIconButton;
