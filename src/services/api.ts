import { create } from "axios";

export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.gommo.tick.local",
  timeout: 12000
});
