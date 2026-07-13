import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

/**
 * No Android Expo Go (SDK 53+), importar `expo-notifications` dispara
 * DevicePushTokenAutoRegistration → addPushTokenListener → throw.
 * Alertas locais OS ficam desabilitados; o poll in-app continua normal.
 */
function canUseNativeNotifications(): boolean {
    if (Platform.OS === "web") {
        return false;
    }
    if (Platform.OS === "android" && isRunningInExpoGo()) {
        return false;
    }
    return true;
}

type NotificationsModule = typeof import("expo-notifications");

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let permissionRequested = false;

async function loadNotificationsModule(): Promise<NotificationsModule | null> {
    if (!canUseNativeNotifications()) {
        return null;
    }
    if (!notificationsModulePromise) {
        notificationsModulePromise = import("expo-notifications")
            .then((Notifications) => {
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowBanner: true,
                        shouldShowList: true,
                        shouldPlaySound: true,
                        shouldSetBadge: true
                    })
                });
                return Notifications;
            })
            .catch((error) => {
                console.warn("[tick] Falha ao carregar expo-notifications:", error);
                return null;
            });
    }
    return notificationsModulePromise;
}

export async function ensureNotificationPermissions() {
    const Notifications = await loadNotificationsModule();
    if (!Notifications) {
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
    const Notifications = await loadNotificationsModule();
    if (!Notifications) {
        return;
    }
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
