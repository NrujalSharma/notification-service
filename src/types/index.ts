export type NotifierConfig = {
    email?: string;
    phone_no?: string;
    title: string;
    content: string;
}

export type NotificationConfig = {
    title: string;
    template: string;
    category: string;
    medium: NotificationMediums;
    userId?: number;
    createdBy: number;
    sendAt?: Date;
    type?: string;
    frequency?: string;
    status?: string;
}

type NotificationConfigWithId = {
    failedNotificationId?: number;
    notificationId: number;
};

export type SendNotificationConfig = NotificationConfig & NotificationConfigWithId;

export type FailedNotificationConfig = {
    notificationId: number;
    userId?: number;
    error?: string;
    failedNotificationId?: number;
}

export type NotificationMediums = 'email' | 'whatsapp';