import * as mysql from 'mysql2/promise';
import { SendNotificationConfig } from '../types';

export class ScheduledNotification {
    async get (pool: mysql.Pool, type: 'regular'| 'failed') {
        try {
            let QUERY: string;

            if (type === 'regular') {
                QUERY = `
                    SELECT *
                    FROM SCHEDULED_NOTIFICATIONS
                    WHERE
                        type <> 'ad-hoc'
                    AND
                        DATE_FORMAT(sendAt, '%Y-%m-%d %H:%i')
                            =
                        DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i')
                    ;
                `;
            } else if (type === 'failed') {
                QUERY = `
                    SELECT *
                    FROM SCHEDULED_FAILED_NOTIFICATIONS
                    WHERE
                        status <> 'failed'
                    AND
                        DATE_FORMAT(sendAt, '%Y-%m-%d %H:%i')
                            =
                        DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i')
                    ;
                `;
            } else {
                throw new Error('Invalid scheduled notification type');
            }

            const [scheduledNotifications, _] = await pool.query(QUERY);
            return scheduledNotifications as unknown as SendNotificationConfig[];
        } catch (error) {
            throw error;
        }
    }
}
