import dotenv from 'dotenv';
dotenv.config();
import { NotificationConfig } from './types';
import { Notification } from './notifications';
import { getConnectionPool } from './database';


/**
 * When the notification config
 * 1. 'sendAt'
 *          has: It schedules future notifications
 *          does not have: sends ad-hoc notifications
 * 2. 'userId'
 *          has: sends the notification to a single user
 *          does not have: sends notification to all subscribers
 * 3. 'frequency'   
 *          has: schedules notification to be sent periodically
 *              possible frequencies are 'daily' and 'monthly'
 */
export async function schedule() {
    try {
        const pool = await getConnectionPool();
        const notificationObj = new Notification();

        // const whatsappAdhoc: NotificationConfig = {
        //     title: 'W Adhoc',
        //     template: 'This is a whatsapp adhoc notification',
        //     category: 'reminder',
        //     medium: 'whatsapp',
        //     createdBy: 1
        // };

        // const whatsappScheduled: NotificationConfig = {
        //     title: 'W Scheduled',
        //     template: 'This is a whatsapp scheduled notification',
        //     category: 'reminder',
        //     medium: 'whatsapp',
        //     createdBy: 1,
        //     sendAt: new Date('2021-05-14 11:00:00')
        // };

        // const emailAdhoc: NotificationConfig = {
        //     title: 'E Adhoc',
        //     template: 'This is an email adhoc notification',
        //     category: 'reminder',
        //     medium: 'email',
        //     createdBy: 1,
        // };

        // const emailScheduled: NotificationConfig = {
        //     title: 'E Scheduled',
        //     template: 'This is an email scheduled notification',
        //     category: 'reminder',
        //     medium: 'email',
        //     createdBy: 1,
        //     sendAt: new Date('2021-05-14 11:00:00'),
        // };

        // notificationObj.schedule(pool, whatsappAdhoc).catch(err => console.error(err));
        // notificationObj.schedule(pool, whatsappScheduled).catch(err => console.error(err));
        // notificationObj.schedule(pool, emailAdhoc).catch(err => console.error(err));
        // notificationObj.schedule(pool, emailScheduled).catch(err => console.error(err));


        const emailUserAdhoc: NotificationConfig = {
            title: 'E Adhoc',
            template: 'This is an email adhoc notification',
            category: 'reminder',
            medium: 'email',
            userId: 1,
            createdBy: 1,
        };
        notificationObj.schedule(pool, emailUserAdhoc).catch(err => console.error(err));
    } catch (error) {
        console.error(error);
    }
}
