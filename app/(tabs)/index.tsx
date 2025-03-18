import {
  View,
  Text,
  FlatList,
  Image,
  Animated,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import AnimatedLottieView from "lottie-react-native";
import ModalComponent from "react-native-modal";
import successAnimation from "../../assets/success.json";
import NetworkStatus from "../components/InternetChecker";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NekoImage {
  url: string;
}

export default function Index() {
  const [images, setImages] = useState<NekoImage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getNekoImages = async (newPage: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nekos.best/api/v2/neko?amount=50&page=${newPage}`
      );
      setImages((prevImages) => [...prevImages, ...response?.data?.results]);
      setPage(newPage);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching Neko images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNekoImages(1);
  }, []);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      setDownloadProgress(0);
      const fileUri = FileSystem.documentDirectory + imageUrl.split("/").pop();

      const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } =
          downloadProgress;
        if (totalBytesExpectedToWrite > 0) {
          const progress =
            (totalBytesWritten / totalBytesExpectedToWrite) * 100;
          setDownloadProgress(Math.round(progress));
        }
      };

      const downloadResumable = FileSystem.createDownloadResumable(
        imageUrl,
        fileUri,
        {},
        callback
      );

      const result = await downloadResumable.downloadAsync();
      if (!result) throw new Error("Download failed");

      await MediaLibrary.createAssetAsync(result.uri);
      const storedImages = await AsyncStorage.getItem("downloadedImages");
      const imagesArray: string[] = storedImages
        ? JSON.parse(storedImages)
        : [];
      imagesArray.push(imageUrl);
      await AsyncStorage.setItem(
        "downloadedImages",
        JSON.stringify(imagesArray)
      );

      setDownloadProgress(100);
      setTimeout(() => setDownloadProgress(null), 1000);
      setSuccessModal(true);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadProgress(null);
    }
  };

  return (
    <View className="flex-1 bg-[#0F2027] px-4 py-6">
      <Text className="text-4xl font-extrabold text-white text-center my-6 shadow-lg">
        <Text className="text-purple-400">Neko</Text>
        <Text className="text-pink-500"> Images 🐱✨</Text>
      </Text>

      <FlatList
        data={images}
        keyExtractor={(item, index) => `image-${index}`}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => openModal(item.url)}
            className="w-1/3 px-2 mb-4"
          >
            <Animated.View
              style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <Image
                source={{ uri: item.url }}
                className="w-full h-40"
                resizeMode="cover"
              />
              <View className="p-1">
                <Text className="text-center text-xs font-semibold text-gray-700">
                  Neko #{index + 1}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}
        onEndReached={() => getNekoImages(page + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#fff" />
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-80 justify-center items-center">
          <TouchableOpacity
            className="absolute top-10 right-5"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white text-2xl">✖</Text>
          </TouchableOpacity>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-80 h-80 rounded-lg"
              resizeMode="contain"
            />
          )}

          <TouchableOpacity
            onPress={() => selectedImage && downloadImage(selectedImage)}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg shadow-md"
          >
            <Text className="text-white font-bold">
              {downloadProgress !== null && downloadProgress < 100
                ? `Downloading... ${downloadProgress}%`
                : "Download"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ModalComponent
        isVisible={successModal}
        animationIn="bounceIn"
        animationOut="bounceOut"
      >
        <View className="bg-white p-6 rounded-xl items-center shadow-lg">
          <AnimatedLottieView
            source={successAnimation}
            autoPlay
            loop={false}
            style={{ width: 100, height: 100 }}
          />
          <Text className="text-xl font-bold text-green-600 mt-4">
            Download Successful! 🎉
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Your Neko image has been saved! 🐱✨
          </Text>
          <TouchableOpacity
            onPress={() => setSuccessModal(false)}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg shadow-md"
          >
            <Text className="text-white font-bold">OK</Text>
          </TouchableOpacity>
        </View>
      </ModalComponent>
      <NetworkStatus />
    </View>
  );
}
