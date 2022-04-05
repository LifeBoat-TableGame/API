import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import CreateUserDto from './dto/createUserDto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

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

    async create(userData: CreateUserDto) {
        const newUser = await this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        return newUser;
    }
}
