export interface Subscription {
    event: Events;
    callback: (...args: any[]) => void;
}
export enum Events {
    Error = "exception",
    PlayerInfo = "playerInfo"
}