import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lobby } from '../models/lobby.entity';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';
import { CreateLobbyPwdDto, CreateLobbyDto } from './dto/createLobbyDto';

@Injectable()
export class LobbyService {
    constructor( @InjectRepository(Lobby) private lobbyRepository: Repository<Lobby>) {}

    async getLobbies() {
        return await this.lobbyRepository.find();
    }

    async getById(id: number) {
        return await this.lobbyRepository.findOne({
            where: { id }
        });
    }

    async getWithRelations(id: number) {
        const lobby = await this.lobbyRepository
            .createQueryBuilder()
            .select("lobby")
            .where("lobby.id = :id", {id: id})
            .leftJoinAndSelect("lobby.creator", "user")
            .leftJoinAndSelect("lobby.users", "user")
            .getOne();
        return lobby;
    }

    async createLobby(lobbyDto: CreateLobbyDto | CreateLobbyPwdDto){
        if(lobbyDto.creator.lobby) 
            throw new WsException('You are already in the lobby');
        const lobby = this.lobbyRepository.create(lobbyDto);
        return await this.lobbyRepository.save(lobby);
    }

    async joinLobby(user: User, lobbyId: number, password?: string) {
        const lobby = await this.lobbyRepository.findOne({
            where: { id: lobbyId }
        });
        if(lobby.password != password) 
            throw new WsException('Incorrect password');
        if(user.lobby)
            throw new WsException('You are already in Lobby');
        if(lobby.users.length == lobby.limit)
            throw new WsException('No empty slots');
        lobby.users.push(user);
        return await this.lobbyRepository.save(lobby);
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
