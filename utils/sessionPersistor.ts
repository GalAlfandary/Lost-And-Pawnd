import AsyncStorage from "@react-native-async-storage/async-storage";

const ROUTE_KEY      = "LAST_ROUTE";
const TIMESTAMP_KEY  = "LAST_ACTIVE_TS";

export async function saveLastRoute(path: string) {
  await Promise.all([
    AsyncStorage.setItem(ROUTE_KEY, path),
    AsyncStorage.setItem(TIMESTAMP_KEY, Date.now().toString()),
  ]);
}

export async function loadLastRoute() {
  const [path, tsString] = await Promise.all([
    AsyncStorage.getItem(ROUTE_KEY),
    AsyncStorage.getItem(TIMESTAMP_KEY),
  ]);
  return { path, ts: tsString ? Number(tsString) : null };
}

export async function clearLastRoute() {
  await AsyncStorage.multiRemove([ROUTE_KEY, TIMESTAMP_KEY]);
}
