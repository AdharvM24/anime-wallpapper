import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Search Icon

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { colorScheme } = useColorScheme();
  const LIMIT = 30; // Load 30 images per request

  // Category data
  const categories = {
    "versatile": [
      "maid", "waifu", "marin-kitagawa", "mori-calliope",
      "raiden-shogun", "oppai", "selfies", "uniform", "kamisato-ayaka"
    ],
    "nsfw": [
      "ass", "hentai", "milf", "oral", "paizuri", "ecchi", "ero"
    ]
  };

  // Fetch images from API with pagination
  const fetchImages = async (category, pageNumber = 1) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.waifu.im/search?included_tags=${category}&many=true&limit=${LIMIT}&page=${pageNumber}`
      );
      const data = await response.json();
      
      if (pageNumber === 1) {
        setImages(data.images || []); // First page -> Replace images
      } else {
        setImages((prevImages) => [...prevImages, ...(data.images || [])]); // Append new images
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
    if (searchText.trim() !== '') {
      setSelectedCategory(searchText); // Set the search query as a category
      fetchImages(searchText, 1); // Fetch images based on search
    }
  };

  // Render category buttons
  const renderCategoryButtons = (categoryItems) => (
    <FlatList
      horizontal
      data={categoryItems}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          className={`rounded-full px-3 py-1 mr-2 h-10 justify-center ${selectedCategory === item ? 'bg-purple-700' : 'bg-purple-400'}`}
          onPress={() => fetchImages(item, 1)}
        >
          <Text className="text-white text-sm font-medium">{item}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View className="flex-1 p-4 bg-[#0F2027]">
      {/* Search Box with Search Button */}
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
      {loading && images.length === 0 && <ActivityIndicator size="large" color="#d8a3e6" className="mt-4" />}

      {/* Display Images with Infinite Scroll */}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.url }}
            className="w-full h-60 mb-4 rounded-lg"
            resizeMode="cover"
          />
        )}
        onEndReached={loadMoreImages} // Load more when reaching the end
        onEndReachedThreshold={0.5} // Load more when reaching 50% of the list
        ListFooterComponent={loading && <ActivityIndicator size="small" color="#d8a3e6" />}
      />
    </View>
  );
}
