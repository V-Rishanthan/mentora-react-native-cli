import { Text, TouchableOpacity } from "react-native";

export default function Button({text,onPress }) {
  return (
    <TouchableOpacity
      className="bg-primary py-4 rounded-full shadow-lg"
      activeOpacity={0.8}
      onPress={onPress }
    >
      <Text className="text-WHITE text-center text-xl font-semibold">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
