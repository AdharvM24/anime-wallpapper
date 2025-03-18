import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    setTimeout(() => {
      onFinish(); // Navigate to the main screen after the animation
    }, 3000); // Adjust duration if needed
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/splash.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F2027",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200, // Adjust size as needed
    height: 200,
  },
});

export default SplashScreen;
