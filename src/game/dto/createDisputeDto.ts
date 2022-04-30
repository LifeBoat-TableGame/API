import { Game } from "../../models/game.entity";
import { GameSupply } from "../../models/gameSupply.entity";
import { Player } from "../../models/player.entity";
import { DisputeType } from "../../models/dispute.entity";

export interface CreateOpenSupplyDisputeDto {
    game: Game;

    initiator: Player;

    victim: Player;

    target: GameSupply;

    type: DisputeType;
}

export interface CreateDisputeDto {
    game: Game;

    initiator: Player;

    victim: Player;

    type: DisputeType;
}