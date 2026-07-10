import { useNotificationSummary } from "@/features/notifications/hooks/useNotifications";

/** Mantém o poll de notificações ativo e dispara alerta local ao chegar item novo. */
export function NotificationListener() {
    useNotificationSummary({ presentAlerts: true });
    return null;
}
