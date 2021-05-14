import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { NotifierConfig } from '../types';
import { Notifier } from './abstractNotifier';

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    }
});

/**
 * This is the concrete implementation of
 * an email notifier using node-mailer and gmail
 * It also contains proper validations
 */
export class EmailNotifier implements Notifier {
    async send(params: NotifierConfig) {
        try {
            if (!(params.email && params.title && params.content)) {
                throw new Error('Invalid params')
            }
            const data = await this.sendMail({
                to: params.email,
                subject: params.title,
                text: params.content
            });

            return {
                data,
                success: true,
            };
        } catch (error) {
            throw error;
        }
    }

    sendMail(mailOptions: Mail.Options) {
        return new Promise<void>((resolve, reject) => {
            mailOptions = {
                ...mailOptions,
                from: process.env.MAIL_USER,
            }

            transporter.sendMail(mailOptions, function (error, data) {
                if (error) {
                    console.log(error)
                    reject(error);
                }
                resolve(data);
            });
        });
    }
}