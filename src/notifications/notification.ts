import * as mysql from 'mysql2/promise';
import { getUTCDate } from '../helpers';
import { NotifierFactory } from '../notifiers';
import { NotificationConfig, NotifierConfig, SendNotificationConfig } from '../types';
import { FailedNotification } from './';

export class Notification {
    async schedule(pool: mysql.Pool, params: NotificationConfig) {
        try {
            const CREATE_NOTIFICATION = `
                INSERT INTO notifications
                (
                    title,
                    template,
                    category,
                    medium,
                    type,
                    frequency,
                    userId,
                    createdBy,
                    sendAt,
                    createdAt,
                    updatedAt
                ) VALUES (
                    ?,
                    ?,
                    (SELECT id FROM notification_categories WHERE name = ?),
                    (SELECT id FROM notification_mediums WHERE name = ?),
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                );
            `;

            const currentUTCTime = getUTCDate();
            if (params.sendAt && params.sendAt < currentUTCTime) {
                throw new Error('Cannot Schedule Notifications for time which has already passed');
            } else if (params.frequency && !params.sendAt) {
                throw new Error('Cannot create ad-hoc periodic notification');
            }
            const scheduledAt = params.sendAt || currentUTCTime;

            const values = [
                params.title,
                params.template,
                params.category,
                params.medium,
                params.sendAt ? 'pre-scheduled' : 'ad-hoc',
                params.frequency,
                params.userId,
                params.createdBy,
                scheduledAt,
                currentUTCTime,
                currentUTCTime
            ];

            // @ts-ignore
            const [{ insertId: notificationId }, _] = await pool.query(CREATE_NOTIFICATION, values);

            if (params.sendAt) {
                return {
                    success: true,
                    message: `Scheduled notification at ${scheduledAt}`
                }
            } else {
                return await this.send(pool, {
                    ...params,
                    notificationId
                })
            }
        } catch (error) {
            throw error;
        }
    }

    async send(pool: mysql.Pool, params: SendNotificationConfig) {
        const failedNotification = new FailedNotification();
        const failedNotificationIds: number[] = [];

        try {
            const factory = new NotifierFactory();
            const notifier = factory.getNotifier(params.medium);

            let GET_USERS = `
                SELECT *
                FROM users
            `;
            const values = [];

            if (params.userId) {
                GET_USERS += `
                    WHERE id = ?
                `
                values.push(params.userId);
            }

            const [data, _] = await pool.query(GET_USERS, values);
            const users = data as any;

            const notificationData: NotifierConfig = {
                title: params.title,
                content: params.template
            }
            // throw  new Error('My Error');
            for (const user of users) {
                const userNotificationData: NotifierConfig = {
                    ...notificationData,
                    email: user.email,
                    phone_no: user.phone_no
                }
                try {
                    // throw  new Error('My Error');
                    await notifier.send(userNotificationData);
                    if (params.failedNotificationId) {
                        await failedNotification.setSuccess(pool, params);
                    }
                } catch (error) {
                    const failedNotificationData = {
                        notificationId: params.notificationId,
                        userId: user.id,
                        error: error.message,
                        failedNotificationId: params.failedNotificationId
                    };

                    const d = await failedNotification.upsert(pool, failedNotificationData);
                    if (d.failedNotificationId) {
                        failedNotificationIds.push(d.failedNotificationId);
                    }
                }
            }

            if (!params.userId && params.failedNotificationId) {
                await failedNotification.setSuccess(pool, params);
            }
        } catch (error) {
            console.error(error);
            await failedNotification.upsert(pool, params);
        }

        if (params.frequency) {
            this.updatePeriodicNotificationTime(pool, params);
        }
        return {
            success: true,
            failedNotificationIds
        }
    }

    async updatePeriodicNotificationTime(pool: mysql.Pool, params: SendNotificationConfig) {
        try {
            let interval: string;
            switch (params.frequency) {
                case 'daily':
                    interval = '1 DAY';
                    break;
                case 'monthly':
                    interval = '1 MONTH';
                    break;
                default:
                    interval = '';
            }

            if (interval) {
                const QUERY = `
                    UPDATE notifications
                    SET
                        sendAt = DATE_ADD(sendAt, INTERVAL ${interval})
                    WHERE
                        id = ?
                    ;
                `;

                const values = [params.notificationId];

                await pool.query(QUERY, values);
            }
        } catch (error) {
            console.error('error');
        }
        return {
            success: true
        }
    }
}
