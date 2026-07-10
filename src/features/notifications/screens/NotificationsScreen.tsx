import { ActivityIndicator, Pressable, View } from "react-native";
import { BellRing } from "lucide-react-native";

import { Card } from "@/components/system/card/Card";
import { Header } from "@/components/system/header/Header";
import { Screen } from "@/components/system/screen/Screen";
import { AppText } from "@/components/system/typography/AppText";
import { colors } from "@/theme/colors";

import { useMarkNotificationRead, useNotificationSummary } from "../hooks/useNotifications";
import type { TickNotification } from "../types/notification.types";

function formatRelativeTime(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return "agora";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    return `${days} d`;
}

function NotificationItem({
    item,
    onPress
}: {
    item: TickNotification;
    onPress: () => void;
}) {
    const unread = !item.readAt;
    const tone = item.title.toLowerCase().includes("recus")
        ? colors.warning
        : item.title.toLowerCase().includes("aprov")
          ? colors.success
          : colors.info;

    return (
        <Pressable
            accessibilityRole="button"
            className="flex-row gap-3 border-b border-[#f2eff7] py-4"
            onPress={onPress}
            style={({ pressed }) => (pressed ? { opacity: 0.72 } : null)}
        >
            <View className="mt-1 h-3 w-3 rounded-md" style={{ backgroundColor: tone }} />
            <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between">
                    <AppText className={`flex-1 pr-3 ${unread ? "font-inter-extrabold" : "font-inter-semibold"}`}>
                        {item.title}
                    </AppText>
                    <AppText variant="label">{formatRelativeTime(item.createdAt)}</AppText>
                </View>
                <AppText variant="label">{item.message}</AppText>
            </View>
        </Pressable>
    );
}

export function NotificationsScreen() {
    const summaryQuery = useNotificationSummary();
    const markRead = useMarkNotificationRead();
    const notifications = summaryQuery.data?.notifications ?? [];
    const unreadCount = summaryQuery.data?.unreadCount ?? 0;

    return (
        <Screen backgroundColor={colors.surface}>
            <Header title="Notificações" />

            <Card className="flex-row items-center gap-3">
                <View className="h-11 w-11 items-center justify-center rounded-[22px] bg-primarySoft">
                    <BellRing color={colors.primary} size={24} />
                </View>
                <View className="flex-1 gap-1">
                    <AppText className="font-inter-extrabold">
                        {unreadCount} {unreadCount === 1 ? "nova atualização" : "novas atualizações"}
                    </AppText>
                    <AppText variant="label">Acompanhe avisos importantes sobre sua jornada.</AppText>
                </View>
            </Card>

            <AppText className="mb-2 mt-5" variant="label">
                RECENTES
            </AppText>

            <Card className="py-1">
                {summaryQuery.isLoading ? (
                    <View className="items-center justify-center py-8">
                        <ActivityIndicator color={colors.primary} />
                    </View>
                ) : notifications.length === 0 ? (
                    <View className="py-8">
                        <AppText center variant="label">
                            Nenhuma notificação por enquanto.
                        </AppText>
                    </View>
                ) : (
                    notifications.map((item) => (
                        <NotificationItem
                            key={item.id}
                            item={item}
                            onPress={() => {
                                if (!item.readAt) {
                                    markRead.mutate(item.id);
                                }
                            }}
                        />
                    ))
                )}
            </Card>
        </Screen>
    );
}
