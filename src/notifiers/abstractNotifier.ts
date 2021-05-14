import { NotifierConfig } from "../types";

export abstract class Notifier {
    public abstract send(params: NotifierConfig): Promise<{
        success: boolean;
        data: any;
    }>;
}
