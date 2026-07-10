import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
});

let permissionRequested = false;

export async function ensureNotificationPermissions() {
    if (Platform.OS === "web") {
        return false;
    }
    if (permissionRequested) {
        return true;
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
        permissionRequested = true;
        return true;
    }
    const requested = await Notifications.requestPermissionsAsync();
    permissionRequested = requested.granted;
    return requested.granted;
}

export async function presentLocalNotification(title: string, body: string) {
    const allowed = await ensureNotificationPermissions();
    if (!allowed) {
        return;
    }
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true
        },
        trigger: null
    });
}
