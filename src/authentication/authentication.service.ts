import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {v4 as uuidv4} from 'uuid';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthenticationService {
    constructor(private userService: UserService) {}
    
    async register() {
        const uuid = uuidv4();
        return await this.userService.createUser({token: uuid});
    }
    async validate(token: string) {
        const user =  await this.userService.getByToken(token);
        return user != null;
    }
    async rename(token: string, newName: string) {
        const user = await this.userService.getByToken(token);
        if(!user) throw new WsException('user not found');
        return await this.userService.renameUser(user, newName);
    }
}
