
import { Text, View } from 'react-native'

export default function SectionTitle({hero,sub}) {
  return (
    //px-8
    <View className="px-8">
        <Text className="text-4xl font-outfit-bold mb-4">{hero}</Text>
        <Text className="text-gray font-outfit-regular text-lg mb-3">
         {sub}
        </Text>
      </View>
  )
}