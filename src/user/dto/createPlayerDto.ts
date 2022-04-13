import { Game } from "../../models/game.entity";
import { Character } from "../../models/character.entity";
import { User } from "../../models/user.entity";

export class CreatePlayerDto {
    user: User;

    character: Character;

    friendship: Character;

    enemy: Character;

}

export class CreatePlayerInGameDto {
    user: User;

    character: Character;

    friendship: Character;

    enemy: Character;

    game: Game;
}
export default CreatePlayerDto;