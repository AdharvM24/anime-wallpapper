import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "../app/components/SplashScreem";
import "./global.css";
// import NetworkStatus from "../components/InternetChecker";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {/* Hide the status bar for a full-screen effect */}
      <StatusBar hidden={true} />

      {isLoading ? (
        <SplashScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      )}
    </>
  );
}
