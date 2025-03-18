import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { useColorScheme } from "nativewind";
import Ionicons from "react-native-vector-icons/Ionicons";

interface ImageItem {
  url: string;
}

export default function Search() {
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const LIMIT = 30;

  // Category data
  const categories = {
    versatile: [
      "maid",
      "waifu",
      "marin-kitagawa",
      "mori-calliope",
      "raiden-shogun",
      "oppai",
      "selfies",
      "uniform",
      "kamisato-ayaka",
    ],
    nsfw: ["ass", "hentai", "milf", "oral", "paizuri", "ecchi", "ero"],
  };

  // Fetch images from API
  const fetchImages = async (category: string, pageNumber: number = 1) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.waifu.im/search?included_tags=${category}&many=true&limit=${LIMIT}&page=${pageNumber}`
      );
      const data = await response.json();

      if (pageNumber === 1) {
        setImages(data.images || []);
      } else {
        setImages((prevImages) => [...prevImages, ...(data.images || [])]);
      }

      setPage(pageNumber);
      setSelectedCategory(category);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  // Load more images when scrolling reaches end
  const loadMoreImages = () => {
    if (!loading && selectedCategory) {
      fetchImages(selectedCategory, page + 1);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchText.trim() !== "") {
      setSelectedCategory(searchText);
      fetchImages(searchText, 1);
    }
  };

  // Open modal on long press
  const handleLongPress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // Render category buttons
  const renderCategoryButtons = (categoryItems: string[]) => (
    <FlatList
      horizontal
      data={categoryItems}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          className={`rounded-full px-3 py-1 mr-2 h-10 justify-center ${
            selectedCategory === item ? "bg-purple-700" : "bg-purple-400"
          }`}
          onPress={() => fetchImages(item, 1)}
        >
          <Text className="text-white text-sm font-medium">{item}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View className="flex-1 p-4 bg-[#0F2027]">
      {/* Search Box */}
      <View className="flex-row items-center border border-gray-300 bg-gray-50 rounded-full px-4 py-2 mb-4">
        <TextInput
          className="flex-1 text-black"
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={handleSearch} className="ml-2">
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Versatile Categories */}
      <View className="mb-1">
        <Text className="text-white text-xs mb-1 ml-1">Versatile</Text>
        {renderCategoryButtons(categories.versatile)}
      </View>

      {/* NSFW Categories */}
      <View>
        <Text className="text-white text-xs mb-1 ml-1">NSFW</Text>
        {renderCategoryButtons(categories.nsfw)}
      </View>

      {/* Loading Indicator for First Load */}
      {loading && images.length === 0 && (
        <ActivityIndicator size="large" color="#d8a3e6" className="mt-4" />
      )}

      {/* Display Images with Infinite Scroll */}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item.url)}>
            <Image
              source={{ uri: item.url }}
              className="w-full h-60 mb-4 rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        onEndReached={loadMoreImages}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <ActivityIndicator size="small" color="#d8a3e6" />
        }
      />

      {/* Image Popup Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-75">
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-[90%] h-[80%] rounded-lg"
              resizeMode="contain"
            />
          )}
          <Pressable
            onPress={() => setModalVisible(false)}
            className="absolute top-5 right-5 bg-gray-800 p-2 rounded-full"
          >
            <Ionicons name="close" size={30} color="white" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
