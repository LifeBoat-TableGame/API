import { Game } from "../../models/game.entity";
import { Player } from "../../models/player.entity";
import { DisputeType } from "../../models/dispute.entity";
import { Supply } from "../../models/supply.entity";

export interface CreateOpenSupplyDisputeDto {
    game: Game;

    initiator: Player;

    victim: Player;

    target: Supply;

    type: DisputeType;

    queueIndex: number;
}

export interface CreateDisputeDto {
    game: Game;

    initiator: Player;

    victim: Player;

    type: DisputeType;

    queueIndex: number;
}