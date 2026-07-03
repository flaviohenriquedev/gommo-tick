import * as SecureStore from "expo-secure-store";

export const secureStorage = {
  getToken: () => SecureStore.getItemAsync("gommo_tick_token"),
  setToken: (token: string) => SecureStore.setItemAsync("gommo_tick_token", token),
  clearToken: () => SecureStore.deleteItemAsync("gommo_tick_token")
};
