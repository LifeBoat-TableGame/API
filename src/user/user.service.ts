import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../models/player.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import CreatePlayerDto from './dto/createPlayerDto';
import CreateUserDto from './dto/createUserDto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Player) private playerRepository: Repository<Player>) {}

    async getByToken(token: string) {
        const user: User | null = await this.userRepository.findOne({
            where: { token }
        });
        return user;
    }

    async renameUser(user: User, name: string) {
        const result = await this.userRepository.update({token: user.token}, {username: name});
        return result.affected == 1;
    }

    async getWithRelations(token: string) {
        const user = await this.userRepository
        .createQueryBuilder("user")
        .where("user.token = :token", {token: token})
        .leftJoinAndSelect("user.player", "player")
        .getOne();
        return user;
    }

    async createPlayer(playerData: CreatePlayerDto) {
        const newPlayer = await this.playerRepository.create(playerData);
        await this.playerRepository.save(newPlayer);
        return newPlayer;
    }

    async createUser(userData: CreateUserDto) {
        const newUser = await this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        return newUser;
    }
}
