import { api } from "@/services/api";

import type { TickNotification, TickNotificationSummary } from "../types/notification.types";

class NotificationService {
    async getMobileSummary() {
        const response = await api.get<TickNotificationSummary>("/api/v1/notifications/mobile");
        return response.data;
    }

    async markAsRead(id: string) {
        const response = await api.post<TickNotification>(`/api/v1/notifications/${id}/read`);
        return response.data;
    }
}

export const notificationService = new NotificationService();
