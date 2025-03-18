import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the expected structure for image data
interface ImageData {
  jpg: {
    image_url: string;
  };
}

export default function Profile() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<number>(
    () => Math.floor(Math.random() * 20000) + 1
  ); // Initial random character ID

  console.log("Current Character ID:", id);

  const fetchImages = async (characterId: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get<{ data: ImageData[] }>(
        `https://api.jikan.moe/v4/characters/${characterId}/pictures`
      );
      setImages((prevImages) => [...prevImages, ...response.data.data]); // Append new images
      setId((prevId) => prevId + 1); // Increment character ID for the next request
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages(id);
  }, []);

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#0F2027" }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "900",
          textAlign: "center",
          color: "#ffffff",
          marginVertical: 16,
          textShadowColor: "rgba(0, 0, 0, 0.75)",
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 5,
        }}
      >
        <Text style={{ color: "#A855F7" }}>Neko</Text>
        <Text style={{ color: "#EC4899" }}> Images 🐱✨</Text>
      </Text>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item?.jpg?.image_url }}
            style={{ width: "100%", height: 200, marginBottom: 10 }}
          />
        )}
        onEndReached={() => fetchImages(id)} // Fetch with the updated ID
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
}
