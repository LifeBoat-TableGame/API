import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lobby } from '../models/lobby.entity';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';
import { CreateLobbyPwdDto, CreateLobbyDto } from './dto/createLobbyDto';

@Injectable()
export class LobbyService {
    constructor( 
        @InjectRepository(Lobby) private lobbyRepository: Repository<Lobby>,
        @InjectRepository(User) private userRepository: Repository<User>,
        ) {}

    async getLobbies(includeUsers: boolean = false) {
        const lobbies =  await this.lobbyRepository
            .createQueryBuilder("lobby")
            .leftJoinAndSelect("lobby.users", "user")
            .getMany();
        return lobbies.map(lobby => { 
            lobby.usersCount = lobby.users.length;  
            if(!includeUsers)  
                delete lobby.users; 
            return lobby
        });
    }

    async getById(id: number) {
        return await this.lobbyRepository.findOne({
            where: { id }
        });
    }

    async getWithRelations(id: number) {
        const lobby = await this.lobbyRepository
            .findOne({
                where: { id },
                relations: {
                    users: true,
                    creator: true
                }
            });
        return lobby;
    }

    async createLobby(lobbyDto: CreateLobbyDto | CreateLobbyPwdDto){
        if(lobbyDto.creator.lobby) 
            throw new WsException('You are already in the lobby');
        const lobby = this.lobbyRepository.create(lobbyDto);
        const newLobby = await this.lobbyRepository.save(lobby);
        const user = lobbyDto.creator;
        user.lobby = newLobby;
        await this.userRepository.save(user);
        return newLobby.id;
    }

    async joinLobby(user: User, lobbyId: number, password?: string) {
        console.log('joining');
        const lobby = await this.getWithRelations(lobbyId);
        if(lobby.password != password) 
            throw new WsException('Incorrect password');
        if(user.lobby)
            throw new WsException('You are already in Lobby');
        if(lobby.users && lobby.users.length == lobby.limit)
            throw new WsException('No empty slots');
        user.lobby = lobby;
        await this.userRepository.save(user);
        return lobby.id;
    }

    async leaveLobby(user: User, lobbyId: number) {
        const lobby = await this.getWithRelations(lobbyId);
        if(user.lobby.id != lobby.id)
            throw new WsException('You are not in that lobby');
        if(lobby.creator.id == user.id) 
            return await this.lobbyRepository.remove(lobby);
        lobby.users.filter(usr => usr.id != user.id);
        return await this.lobbyRepository.save(lobby);
    }
}
