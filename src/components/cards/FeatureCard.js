import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

export default function FeatureCard({ title, image, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl shadow-md p-4 m-2 w-[45%]"
    >
      <Image
        source={image}
        style={{ width: 60, height: 60 }}
        contentFit="contain"
      />

      <Text className="mt-3 text-center font-semibold">
        {title}
      </Text>
    </Pressable>
  );
}