// app/_layout.js
import "react-native-gesture-handler";            // ➊ keep FIRST
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Text, TextInput } from "react-native";

// prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    JaldiRegular: require("../assets/fonts/Jaldi-Regular.ttf"),
    JaldiBold: require("../assets/fonts/Jaldi-Bold.ttf"),
  });

  /* wait for fonts, then hide splash */
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  /* apply default font globally */
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: "JaldiRegular" };

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = { fontFamily: "JaldiRegular" };

  /* ➋ wrap everything in GestureHandlerRootView */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
