import dotenv from 'dotenv';
dotenv.config();
import { NotifierFactory } from '../notifiers';
import { NotifierConfig } from '../types';

let factory: NotifierFactory;
const notificationData: NotifierConfig = {
    title: 'Title while testing',
    content: 'Content while testing'
}

beforeAll(async () => {
    factory = new NotifierFactory();
});

test('Send email notification with incorrect params', async () => {
    try {
        const notifier = factory.getNotifier('email');
        return expect(notifier.send({
            ...notificationData
        })).rejects.toEqual(new Error('Invalid params'))
    } catch (error) {
        console.error(error)
    }
}, 10000);

test('Send email notification with correct params', async () => {
    try {
        const notifier = factory.getNotifier('email');
        return expect(notifier.send({
            ...notificationData,
            email: 'snrujal@gmail.com'
        })).resolves.toEqual(
            expect.objectContaining({
                data: expect.objectContaining({
                    messageId: expect.any(String),
                }),
                success: true,
            }),
        );
    } catch (error) {
        console.error(error)
    }
}, 10000);