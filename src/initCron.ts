import dotenv from 'dotenv';
dotenv.config();
import * as mysql from 'mysql2/promise';
import { CronJob } from 'cron';
import { getConnectionPool } from './database';
import { Notification, ScheduledNotification } from './notifications';
import { SendNotificationConfig } from './types';


let pool: mysql.Pool;
let notificationObj: Notification;
let scheduledNotificationObj: ScheduledNotification;

function sendNotificationsOneByOne(notifications: SendNotificationConfig[]) {
    for (const notification of notifications) {
        notificationObj.send(pool, notification);
    }
}

export async function init() {
    try {
        pool = await getConnectionPool();

        notificationObj = notificationObj || new Notification();
        scheduledNotificationObj = scheduledNotificationObj || new ScheduledNotification();

        // Get regular scheduled notifications
        const scheduledNotificationsCron = new CronJob('0 */1 * * * *', async () => {
            const type = 'regular';
            try {
                const notifications = await scheduledNotificationObj.get(pool, type);
                sendNotificationsOneByOne(notifications);
            } catch (error) {
                console.error(`ERR:: ${type} ---->\n`, error);
            }
        });

        // Get notifications that failed and retry sending them
        const failedNotificationsCron = new CronJob('0 */1 * * * *', async () => {
            const type = 'failed';
            try {
                const notifications = await scheduledNotificationObj.get(pool, type);
                sendNotificationsOneByOne(notifications);
            } catch (error) {
                console.error(`ERR:: ${type} ---->\n`, error);
            }
        });

        /**
         * Start the cron jobs to query DB every minute
         * and send scheduled notifications
         */
        scheduledNotificationsCron.start();
        failedNotificationsCron.start();
    } catch (error) {
        console.error(error);
    }
}
