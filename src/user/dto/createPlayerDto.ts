import { Character } from "../../models/character.entity";
import { User } from "../../models/user.entity";

export class CreatePlayerDto {
    user: User;

    character: Character;

    friendship: Character;

    enemy: Character;

}
export default CreatePlayerDto;