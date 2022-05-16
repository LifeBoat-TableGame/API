import { Game } from "./game";

export type MessageData = {
    [MessageType.GetGameInfo]: undefined,
    [MessageType.Rename]: string,
    [MessageType.StartGame]: undefined,
    [MessageType.GetPlayerInfo]: undefined,
}

export enum MessageType {
    CreateRoom = "createRoom",
    JoinRoom = "joinRoom",
    LeaveRoom = "leaveRoom",
    GetRooms = "getRooms",
    StartGame = "create",
    GetGameInfo = "getGameInfo",
    GetPlayerInfo = "getPlayerInfo",
    Rename = "rename"
}