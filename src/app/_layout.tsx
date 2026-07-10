import "react-native-reanimated";
import "react-native-gesture-handler";
import "@/global.css";

import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    useFonts
} from "@expo-google-fonts/inter";

import { queryClient } from "@/services/queryClient";
import { NotificationListener } from "@/features/notifications/components/NotificationListener";
import { useAuthStore } from "@/store/authStore";

SplashScreen.preventAutoHideAsync();

function AuthenticatedNotifications() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) {
        return null;
    }
    return <NotificationListener />;
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthenticatedNotifications />
            <Stack
                screenOptions={{
                    contentStyle: { backgroundColor: "#f7f5fb" },
                    gestureEnabled: true,
                    headerShown: false
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="register-point" />
                <Stack.Screen name="my-point" />
                <Stack.Screen name="timesheet" />
                <Stack.Screen name="hour-balance" />
                <Stack.Screen name="more" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="requests" />
            </Stack>
        </QueryClientProvider>
    );
}
