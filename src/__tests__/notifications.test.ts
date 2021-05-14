import dotenv from 'dotenv';
dotenv.config();
import { NotificationConfig } from '../types';
import { Notification, ScheduledNotification } from '../notifications';
import { getConnectionPool } from '../database';

import * as mysql from 'mysql2/promise';
import * as iconvlite from 'iconv-lite'
iconvlite.encodingExists('foo');

let pool: mysql.Pool;
let notificationObj: Notification;
let scheduledNotificationObj: ScheduledNotification;

beforeAll(async () => {
    pool = await getConnectionPool();
    notificationObj = new Notification();
    scheduledNotificationObj = new ScheduledNotification();
});

afterAll(async () => {
    await pool.end();
});


test('Send ad-hoc email notification to all users', async done => {
    try {
        const emailAdhoc: NotificationConfig = {
            title: 'E Adhoc',
            template: 'This is an email adhoc notification',
            category: 'reminder',
            medium: 'email',
            createdBy: 1,
        };

        return notificationObj.schedule(pool, emailAdhoc).then(data => {
            expect(data.success).toBe(true);
            done();
        }).catch(err => {
            done(err);
        });
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Send ad-hoc email notification to an existing user', async done => {
    try {
        const emailAdhoc: NotificationConfig = {
            title: 'E Adhoc',
            template: 'This is an email adhoc notification',
            category: 'reminder',
            medium: 'email',
            createdBy: 1,
            userId: 1
        };

        return notificationObj.schedule(pool, emailAdhoc).then(data => {
            expect(data.success).toBe(true);
            done();
        }).catch(err => {
            done(err);
        });
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Schedule email notification for all users', async done => {
    try {
        const emailAdhoc: NotificationConfig = {
            title: 'E Adhoc',
            template: 'This is an email adhoc notification',
            category: 'reminder',
            medium: 'email',
            createdBy: 1,
            sendAt: new Date()
        };

        return notificationObj.schedule(pool, emailAdhoc).then(data => {
            expect(data.success).toBe(true);
            done();
        }).catch(err => {
            done(err);
        });
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Schedule email notification to an existing single user', async done => {
    try {
        const emailAdhoc: NotificationConfig = {
            title: 'E Adhoc',
            template: 'This is an email adhoc notification',
            category: 'reminder',
            medium: 'email',
            createdBy: 1,
            sendAt: new Date(),
            userId: 2
        };

        return notificationObj.schedule(pool, emailAdhoc).then(data => {
            expect(data.success).toBe(true);
            done();
        }).catch(err => {
            done(err);
        });
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Send adhoc whatsapp notification for an existing single user without phone_no', async done => {
    try {
        const whatsappAdhoc: NotificationConfig = {
            title: 'W Adhoc',
            template: 'This is a watsapp adhoc notification',
            category: 'reminder',
            medium: 'whatsapp',
            createdBy: 1,
            userId: 2
        };

        return notificationObj.schedule(pool, whatsappAdhoc).then((data: any) => {
            expect(data.failedNotificationIds.length).toBe(1);
            done();
        }).catch(err => {
            done(err);
        });
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Send ad-hoc periodic email notification to all users', async () => {
    try {
        const emailAdhoc: NotificationConfig = {
            title: 'E Adhoc',
            template: 'This is an email adhoc notification',
            category: 'reminder',
            medium: 'email',
            frequency: 'daily',
            createdBy: 1,
        };

        return expect(notificationObj.schedule(pool, emailAdhoc)).rejects.toEqual(new Error('Cannot create ad-hoc periodic notification'));
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Schedule email notification for a time that has passed', async () => {
    try {
        const emailAdhoc: NotificationConfig = {
            title: 'E Adhoc',
            template: 'This is an email adhoc notification',
            category: 'reminder',
            medium: 'email',
            sendAt: new Date('2021-05-11 10:10:10'),
            createdBy: 1,
        };

        return expect(notificationObj.schedule(pool, emailAdhoc)).rejects.toEqual(new Error('Cannot Schedule Notifications for time which has already passed'));
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Send invalid type to get scheduled notifications', async () => {
    try {
        const type: any = 'abc';
        return expect(scheduledNotificationObj.get(pool, type)).rejects.toEqual(new Error('Invalid scheduled notification type'));
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Get failed scheduled notifications', async done => {
    try {
        const type = 'failed';
        return scheduledNotificationObj.get(pool, type).then(data => {
            expect(data.length).toBeGreaterThanOrEqual(0);
            done();
        }).catch(err => {
            done(err);
        });
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Get regular scheduled notifications', async done => {
    try {
        const type = 'regular';
        return scheduledNotificationObj.get(pool, type).then(data => {
            expect(data.length).toBeGreaterThanOrEqual(0);
            done();
        }).catch(err => {
            done(err);
        });
    } catch (error) {
        console.error(error)
    }
}, 10000);
