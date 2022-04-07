import { User } from "../../models/user.entity";

export class CreateLobbyDto {
    
    creator: User;
    
    name: string;

}
export class CreateLobbyPwdDto {

    creator: User;
    
    name: string;

    password: string;
}
export default CreateLobbyDto;