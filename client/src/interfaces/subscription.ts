import { Game, Player, Supply } from "./game";
import { Room } from "./room";

export type SubscriptionArguments =  {
    [Events.PlayerInfo]: Player,
    [Events.GameInfo]: Game,
    [Events.RoomCreated]: number,
    [Events.GameStarted]: any,
    [Events.UserUpdated]: string,
    [Events.RoomsUpdated]: Room[],
    [Events.UserJoined]: {
        id: number, 
        username: string, 
        lobby: number
    },
    [Events.ChooseNavigation]: any,
    [Events.CardsToChoose]: Supply[],
    [Events.ShowChosenNavigation]: any,
    [Events.Error]: any,
}
export enum Events {
    Error = "exception",
    PlayerInfo = "playerInfo",
    GameInfo = "gameInfo",
    RoomCreated = "RoomCreated",
    GameStarted = "gameStarted",
    UserUpdated = "UserUpdated",
    RoomsUpdated = "updateRooms",
    UserJoined = "userJoined",
    ChooseNavigation = "chooseNavigation",
    CardsToChoose = "toChoose",
    ShowChosenNavigation = "shownChosenNavigation",
}