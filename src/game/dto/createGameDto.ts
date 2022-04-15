import { GameNavigation } from "../../models/gameNavigation.entity";
import { GameState } from "../../models/game.entity";
import { GameSupply } from "../../models/gameSupply.entity";

export class CreateGameDto {

    state: GameState;
    
}

export class CreateGameWithDeckDto {

    state: GameState;

    navigationDeck: GameNavigation[];

    supplyDeck: GameSupply[];
}

export default CreateGameDto;