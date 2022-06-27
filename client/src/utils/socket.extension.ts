import { Socket } from "socket.io-client";
import { InjectionKey } from "vue";
import { MessageData } from "../interfaces/message";
import { SubscriptionArguments } from "../interfaces/subscription";

declare module "socket.io-client" {
    interface Socket {
        sendMessage<K extends keyof MessageData>(message: K, data: MessageData[K]): void;
        sendMessage<K extends keyof MessageData>(message: K): void;

        subscribeToEvent<K extends keyof SubscriptionArguments>(event: K, callback: (arg: SubscriptionArguments[K]) => void): void;
        subscribeToEvent<K extends keyof SubscriptionArguments>(event: K, callback: () => void): void;
    }
}

export const SocketKey: InjectionKey<Socket> = Symbol('Socket');

Socket.prototype.sendMessage = function <K extends keyof MessageData>(message: K, data?: MessageData[K]) {
    if(data) this.emit(message, data);
    else this.emit(message);
}

Socket.prototype.subscribeToEvent = function <K extends keyof SubscriptionArguments>(event: K, callback: (arg?: SubscriptionArguments[K]) => void): void {
    this.on(event as string, callback);
}