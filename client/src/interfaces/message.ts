export interface Message {
    type: MessageType;
    data?: string | object;
}

export enum MessageType {
    CreateRoom = "createRoom",
    JoinRoom = "joinRoom",
    LeaveRoom = "leaveRoom",
    GetRooms = "getRooms",
    StartGame = "create",
    GetGameInfo = "getGameInfo"
}