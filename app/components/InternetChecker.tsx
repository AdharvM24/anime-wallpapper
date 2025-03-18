import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import LottieView from "lottie-react-native";
import Modal from "react-native-modal";

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state?.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Modal
      isVisible={!isConnected}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor="transparent"
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <LottieView
          source={require("../../assets/no-net.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.alertText}>No Internet Connection</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Ensures it covers the whole screen without margins
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Ensures full transparency
  },
  modalContent: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
  alertText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
});

export default NetworkStatus;
