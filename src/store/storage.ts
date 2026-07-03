import { Platform } from "react-native";

const memoryStorage = new Map<string, string>();

const getWebStorage = () => {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

export const storage = {
  getString: (key: string) => getWebStorage()?.getItem(key) ?? memoryStorage.get(key),
  set: (key: string, value: string) => {
    getWebStorage()?.setItem(key, value);
    memoryStorage.set(key, value);
  },
  remove: (key: string) => {
    getWebStorage()?.removeItem(key);
    memoryStorage.delete(key);
  }
};
