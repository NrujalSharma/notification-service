import { NotifierConfig } from '../types';
import { Notifier } from './abstractNotifier';

/**
 * This is a dummy class
 * Implementation to send messages via whatsapp
 * can be made easily here
 */
export class WhatsappNotifier implements Notifier {
    async send(params: NotifierConfig) {
        try {
            if (!(params.phone_no && params.title && params.content)) {
                throw new Error('Invalid params')
            }
            console.log('Sending whatsapp notification to', params.phone_no);
            return {
                success: true,
                data: null
            };
        } catch (error) {
            throw error;
        }
    }
}