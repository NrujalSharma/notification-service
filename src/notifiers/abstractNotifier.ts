import { NotifierConfig } from "../types";

/**
 * This is the abstract notifier
 * The service follows the factory method design pattern
 * to create objects of concrete classes
 */
export abstract class Notifier {
    public abstract send(params: NotifierConfig): Promise<{
        success: boolean;
        data: any;
    }>;
}
