// components/ProgressCircle.jsx
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

const ProgressCircle = ({ percentage, label, size = 80, color = "#8681FB" }) => {
  return (
    <View className="items-center">
      <Progress.Circle
        size={size}
        progress={percentage / 100}
        thickness={6}
        color={color}
        unfilledColor="#E5E7EB"
        borderWidth={0}
        showsText={true}
        formatText={() => `${percentage}%`}
        textStyle={{
          fontSize: 18,
          fontFamily: 'Outfit-Bold',
          color: color,
        }}
      />
      <Text className="font-outfit-medium mt-2 text-gray-700">{label}</Text>
    </View>
  );
};
export default ProgressCircle;