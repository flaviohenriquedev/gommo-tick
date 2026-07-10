export type TickNotification = {
    id: string;
    code: number;
    notificationType: string;
    title: string;
    message: string;
    referenceType?: string;
    referenceId?: string;
    referenceDueDate?: string;
    readAt?: string | null;
    createdAt?: string;
};

export type TickNotificationSummary = {
    unreadCount: number;
    notifications: TickNotification[];
};
