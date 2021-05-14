import * as mysql from 'mysql2/promise';
import { FailedNotificationConfig } from '../types';

export class FailedNotification {

    async upsert(pool: mysql.Pool, params: FailedNotificationConfig) {
        try {
            let QUERY: string, values: any[];

            if (params.userId && params.failedNotificationId) {
                await this.upsertForSingleUser(pool, params);
            }

            if (!params.userId && params.failedNotificationId) {
                QUERY = `
                    UPDATE failed_notifications
                    SET
                        retryCount = IF(retryCount < 3, retryCount + 1, retryCount),
                        status = IF(retryCount = 3, 'failed', 'pending'),
                        sendAt = IF(retryCount = 3, sendAt, DATE_ADD(NOW(), INTERVAL 5 MINUTE)),
                        error = ?,
                        updatedAt = NOW()
                    WHERE
                        id = ?
                `;

                values = [
                    params.error,
                    params.failedNotificationId
                ];

                await pool.query(QUERY, values);
            }

            if (!params.failedNotificationId) {
                QUERY = `
                    INSERT INTO failed_notifications (
                        notificationId,
                        userId,
                        error,
                        sendAt
                    ) VALUES (
                        ?,
                        ?,
                        ?,
                        DATE_ADD(NOW(), INTERVAL 1 MINUTE)
                    );
                `;

                values = [
                    params.notificationId,
                    params.userId,
                    params.error || ''
                ];

                const [d, _] = await pool.query(QUERY, values) as unknown as mysql.OkPacket[];
                params.failedNotificationId = d.insertId;
            }
        } catch (error) {
            console.error('Failed to upsert failedNotification', error, params);
        }
        return {
            success: true,
            failedNotificationId: params.failedNotificationId
        }
    }

    async setSuccess(pool: mysql.Pool, params: FailedNotificationConfig) {
        try {
            if (!params.failedNotificationId) {
                throw new Error('Failed notification ID required');
            }
            const QUERY = `
                UPDATE failed_notifications
                SET
                    retryCount = IF(retryCount < 3, retryCount + 1, retryCount),
                    status = 'success',
                    updatedAt = NOW()
                WHERE
                    id = ?
            `;

            const values = [
                params.failedNotificationId
            ];

            await pool.query(QUERY, values);
        } catch (error) {
            console.error('Failed to set success status for failedNotification', error, params);
        }
        return {
            success: true
        }
    }

    private async upsertForSingleUser(pool: mysql.Pool, params: FailedNotificationConfig) {
        try {
            let QUERY = `
                UPDATE failed_notifications
                SET
                    retryCount = IF(retryCount < 3, retryCount + 1, retryCount),
                    status = IF(retryCount = 3, 'failed', 'pending'),
                    sendAt = IF(retryCount = 3, sendAt, DATE_ADD(NOW(), INTERVAL 1 MINUTE)),
                    error = ?,
                    updatedAt = NOW(),
                    userId = ?
                WHERE
                    id = ?
                AND
                    userId = ?
                ;
            `;

            let values = [
                params.error,
                params.userId,
                params.failedNotificationId,
                params.userId
            ];

            const [d, _] = await pool.query(QUERY, values) as any[];

            if (!d.affectedRows) {
                QUERY = `
                    INSERT INTO failed_notifications (
                        notificationId,
                        userId,
                        error,
                        sendAt
                    ) VALUES (
                        ?,
                        ?,
                        ?,
                        DATE_ADD(NOW(), INTERVAL 1 MINUTE)
                    );
                `;

                values = [
                    params.notificationId,
                    params.userId,
                    params.error || ''
                ];

                await pool.query(QUERY, values);
            }

            return {
                success: true
            }
        } catch (error) {
            throw error;
        }
    }
}
