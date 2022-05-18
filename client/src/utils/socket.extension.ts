import { Socket } from "socket.io-client";
import { InjectionKey } from "vue";
import { MessageData } from "../interfaces/message";
import { Subscription } from "../interfaces/subscription";

interface IExtendedSocket extends Socket {
    sendMessage<K extends keyof MessageData>(message: K, data?: MessageData[K]): void;
    subscribeToEvent(sub: Subscription): void;
}

export const SocketKey: InjectionKey<ExtendedSocket> = Symbol('Socket');

export class ExtendedSocket extends Socket implements IExtendedSocket {
    
    public sendMessage<K extends keyof MessageData>(message: K, data: MessageData[K]): void;
    public sendMessage<K extends keyof MessageData>(message: K): void;
    sendMessage<K extends keyof MessageData>(message: K, data?: MessageData[K]) {
        if(data) this.emit(message, data);
        else this.emit(message);
    }

    public subscribeToEvent(sub: Subscription) {
        this.on(sub.event, sub.callback);
    }

}