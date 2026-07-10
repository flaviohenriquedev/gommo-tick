import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";

import { presentLocalNotification } from "../lib/localNotifications";
import { notificationService } from "../services/notification.service";

export const notificationKeys = {
    all: ["tick-notifications"] as const,
    summary: () => [...notificationKeys.all, "summary"] as const
};

type UseNotificationSummaryOptions = {
    /** Quando true, dispara alerta local ao chegar notificação nova. Use só em um ponto do app. */
    presentAlerts?: boolean;
};

export function useNotificationSummary(options: UseNotificationSummaryOptions | boolean = {}) {
    const normalized = typeof options === "boolean" ? { presentAlerts: options } : options;
    const presentAlerts = normalized.presentAlerts ?? false;
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const knownUnreadIds = useRef<Set<string>>(new Set());
    const bootstrapped = useRef(false);

    const query = useQuery({
        queryKey: notificationKeys.summary(),
        queryFn: () => notificationService.getMobileSummary(),
        enabled: isAuthenticated,
        refetchInterval: 15_000,
        staleTime: 10_000
    });

    useEffect(() => {
        if (!presentAlerts) {
            return;
        }
        const onAppStateChange = (state: AppStateStatus) => {
            if (state === "active") {
                void query.refetch();
            }
        };
        const subscription = AppState.addEventListener("change", onAppStateChange);
        return () => subscription.remove();
    }, [presentAlerts, query]);

    useEffect(() => {
        if (!presentAlerts) {
            return;
        }
        const notifications = query.data?.notifications;
        if (!notifications) {
            return;
        }

        const unread = notifications.filter((item) => !item.readAt);
        const unreadIds = new Set(unread.map((item) => item.id));

        if (!bootstrapped.current) {
            knownUnreadIds.current = unreadIds;
            bootstrapped.current = true;
            return;
        }

        for (const item of unread) {
            if (!knownUnreadIds.current.has(item.id)) {
                void presentLocalNotification(item.title, item.message);
            }
        }
        knownUnreadIds.current = unreadIds;
    }, [presentAlerts, query.data]);

    return query;
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        }
    });
}
