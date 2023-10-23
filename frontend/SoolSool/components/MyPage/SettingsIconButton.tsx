import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SettingsIconButton({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Ionicons name="md-settings-outline" size={24} />
    </Pressable>
  );
}

export default SettingsIconButton;
