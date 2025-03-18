import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import LottieView from "lottie-react-native";
import Modal from "react-native-modal"; // Import the Modal
/* eslint-disable */

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state?.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Modal isVisible={!isConnected} animationIn="fadeIn" animationOut="fadeOut">
      <View style={styles.modalContent}>
        <LottieView
          source={require("../../assets/no-net.json")} // Replace with your Lottie file
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalContent: {
    backgroundColor: "white",
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
    color: "red",
    marginTop: 10,
  },
});

export default NetworkStatus;
