import { NotifierConfig } from '../types';
import { Notifier } from './abstractNotifier';

export class WhatsappNotifier implements Notifier {
    async send(params: NotifierConfig) {
        try {
            if (!params.phone_no) {
                throw new Error('Phone Number required to send Whatsapp notification');
            }
            console.log('Sending whatsapp notification to', params.phone_no);
            return true;
        } catch (error) {
            throw error;
        }
    }
}