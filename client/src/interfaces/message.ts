import { Game } from "./game";

export type MessageData = {
    [MessageType.GetGameInfo]: undefined,
    [MessageType.Rename]: string,
    [MessageType.CreateRoom]: string,
    [MessageType.StartGame]: undefined,
    [MessageType.GetPlayerInfo]: undefined,
    [MessageType.JoinRoom]: number,
    [MessageType.LeaveRoom]: number,
    [MessageType.GetRooms]: undefined,
    [MessageType.PickSupply]: string,
    [MessageType.OpenSupply]: string,
    [MessageType.UseSupply]: { supplyName: string, target: string },
    [MessageType.ShowChosenNavigation]: undefined,
    [MessageType.SwapPlaces]: string,
    [MessageType.DemandSupply]: { targetName: string, supplyName: string | null },
    [MessageType.Row]: undefined,
    [MessageType.PickNavigation]: number,
    [MessageType.AcceptDispute]: undefined,
    [MessageType.DeclineDispute]: undefined,
    [MessageType.TakeSide]: 'Atack' | 'Defend' | 'Neutral',
    
}

export enum MessageType {
    CreateRoom = "createRoom",
    JoinRoom = "joinRoom",
    LeaveRoom = "leaveRoom",
    GetRooms = "getRooms",
    StartGame = "create",
    GetGameInfo = "getGameInfo",
    GetPlayerInfo = "getPlayerInfo",
    Rename = "rename",
    PickSupply = "pickSupply",
    OpenSupply = "openSupply",
    UseSupply = "useSupply",
    ShowChosenNavigation = "showChosenNavigation",
    SwapPlaces = "swap",
    DemandSupply = "demandSupply",
    Row = "getNavigation",
    PickNavigation = "pickNavigation",
    AcceptDispute = "acceptDispute",
    DeclineDispute = "declineDispute",
    TakeSide = "chooseConflictSide"
}