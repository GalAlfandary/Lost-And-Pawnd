// app/_layout.jsx
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { AppState, Text, TextInput } from "react-native";
import { useFonts } from "expo-font";
import { supabase } from "../supabase";
import {
  saveLastRoute,
  loadLastRoute,
} from "../utils/sessionPersistor";

const TIMEOUT_MS = 5 * 60 * 1000; // 5 min

/** 1️⃣  Make “/” the guaranteed home screen */
export const unstable_settings = { initialRouteName: "index" };

export default function RootLayout() {
  /* ---- fonts ----------------------------------------------------------- */
  const [fontsLoaded] = useFonts({
    JaldiRegular: require("../assets/fonts/Jaldi-Regular.ttf"),
    JaldiBold:    require("../assets/fonts/Jaldi-Bold.ttf"),
  });

  /* ---- routing --------------------------------------------------------- */
  const pathname   = usePathname();           // clean URL, no group names
  const router     = useRouter();
  const pathRef    = useRef(pathname);        // latest path for listener

  useEffect(() => { pathRef.current = pathname; }, [pathname]);

  /* ---- Supabase session gate ------------------------------------------ */
  const [sessionReady, setSessionReady] = useState(false);
  useEffect(() => {
    // fires once automatically when the client has hydrated
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(() => setSessionReady(true));
    return () => subscription?.unsubscribe();
  }, []);

  /* ---- background / foreground listener ------------------------------- */
  useEffect(() => {
    const appStateRef = { current: AppState.currentState };

    const sub = AppState.addEventListener("change", async (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      /* leaving → save */
      if (prev === "active" && /inactive|background/.test(next)) {
        await saveLastRoute(pathRef.current);
        return;
      }

      /* returning → hide splash (auto-hide already off) + restore */
      if (/inactive|background/.test(prev) && next === "active") {
        const { path, ts } = await loadLastRoute();
        if (
          path &&
          path !== pathRef.current &&
          ts &&
          Date.now() - ts < TIMEOUT_MS
        ) {
          console.log("[restore] replacing →", path);
          router.replace(path);
        }
      }
    });

    return () => sub.remove();
  }, [router]);

  /* ---- cold-start restore (runs once after auth ready) ----------------- */
  useEffect(() => {
    if (!sessionReady) return;
    (async () => {
      const { path, ts } = await loadLastRoute();
      if (
        path &&
        ts &&
        Date.now() - ts < TIMEOUT_MS &&
        path !== pathRef.current
      ) {
        console.log("[cold-start] replacing →", path);
        router.replace(path);
      }
    })();
  }, [sessionReady, router]);

  /* ---- block UI until all gates pass ---------------------------------- */
  if (!fontsLoaded || !sessionReady) return null;

  /* ---- optional global font defaults ---------------------------------- */
  Text.defaultProps       = Text.defaultProps || {};
  TextInput.defaultProps  = TextInput.defaultProps || {};
  Text.defaultProps.style = { fontFamily: "JaldiRegular" };
  TextInput.defaultProps.style = { fontFamily: "JaldiRegular" };

  /* ---- render ---------------------------------------------------------- */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
