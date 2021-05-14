import { Notifier } from "./abstractNotifier";
import { EmailNotifier } from "./email";
import { WhatsappNotifier } from "./whatsapp";
import { NotificationMediums } from "../types";

export class NotifierFactory {
    getNotifier(medium: NotificationMediums): Notifier {
        try {
            switch (medium) {
                case 'email':
                    return new EmailNotifier()
                case 'whatsapp':
                    return new WhatsappNotifier()
                default:
                    throw new Error('Invalid medium chosen')
            }
        } catch (error) {
            throw error;
        }
    }
}