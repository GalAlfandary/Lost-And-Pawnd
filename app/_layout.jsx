import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Text, TextInput } from "react-native";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    JaldiRegular: require("../assets/fonts/Jaldi-Regular.ttf"), // Load the custom font
    JaldiBold: require("../assets/fonts/Jaldi-Bold.ttf"), // Load the custom font
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log("Fonts loaded successfully");
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  

  if (!fontsLoaded) {
    return null; // Keep the splash screen visible until fonts are loaded
  }

  // Apply the custom font globally
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: "JaldiRegular" };

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = { fontFamily: "JaldiRegular" };

  return <Stack screenOptions={{ headerShown: false }} /> // Hide the header globally;
}
