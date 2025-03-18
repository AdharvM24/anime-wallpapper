import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Saved() {
  const [savedImages, setSavedImages] = useState([]);

  useEffect(() => {
    console.log('storedImages');
    const fetchSavedImages = async () => {
      const storedImages = await AsyncStorage.getItem("downloadedImages");
      console.log('storedImages', storedImages);

      if (storedImages) {
        setSavedImages(JSON.parse(storedImages));
      }
    };
    fetchSavedImages();

  }, []);

  return (
    <View className="flex-1 bg-[#0F2027] px-4 py-6">
      <Text className="text-4xl font-extrabold text-center text-white mb-6 shadow-lg">
  <Text className="text-purple-400">📸 Saved</Text>
  <Text className="text-pink-500"> Neko</Text>
  <Text className="text-yellow-400"> Images 🐱✨</Text>
</Text>
      {savedImages.length > 0 ? (
        <FlatList
          data={savedImages}
          keyExtractor={(item, index) => `saved-${index}`}
          numColumns={2}
          renderItem={({ item }) => (
            <View className="w-1/2 px-2 mb-4">
              <Image source={{ uri: item }} className="w-full h-40 rounded-lg" resizeMode="cover" />
            </View>
          )}
        />
      ) : (
        <Text className="text-center text-gray-400">No saved images yet.</Text>
      )}
    </View>
  );
}
