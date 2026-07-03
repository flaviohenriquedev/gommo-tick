import { Redirect } from "expo-router";

import { useAuthStore } from "@/store/authStore";

export default function IndexRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
}
