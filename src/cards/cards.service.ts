import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supply } from '../models/supply.entity';
import { Repository } from 'typeorm';
import { Character } from '../models/character.entity';
import { Navigation } from '../models/navigation.entity';
import { GameSupply } from '../models/gameSupply.entity';
import CreateGameSupplyDto from '../game/dto/createGameSupplyDto';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Character) private characterRepository: Repository<Character>, 
        @InjectRepository(Supply) private supplyRepository: Repository<Supply>,
        @InjectRepository(Navigation) private navigationRepository: Repository<Navigation>,
        @InjectRepository(GameSupply) private gameSupplyRepository: Repository<GameSupply>
    ) {}
    
    shuffle<Type>(array: Type[]) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    async getCharacter(name: string) {
        const character = this.characterRepository.findOne({
            where: { name }
        });
        return character;
    }

    async getSupply(name: string) {
        const supply = this.supplyRepository.findOne({
            where: { name }
        });
        return supply;
    }
    async getAllSupplies() {
        return this.supplyRepository.find();
    }

    async getAllCharacters() {
        return this.characterRepository.find();
    }

    async getRandomCharacters(amount?: number) {
        const characters = await this.characterRepository.find();
        const array = this.shuffle(characters);
        if(amount) return array.slice(0, amount);
        else return array;
    }

    async getAllNavigations() {
        return this.navigationRepository.find();
    }

    async getNavigation(id: number){
        const nav = this.navigationRepository.findOne({
            where: { id },
            relations: {
                charactersOverboard: true,
                charactersThirst: true,
            },
        });
        return nav;
    }

    async drawSupplies(amount: number, gameId: number) {
        const selected = await this.gameSupplyRepository
        .createQueryBuilder("game_supply")
        .where("game_supply.picked is false AND game_supply.gameId = :gameId", {gameId: gameId})
        .orderBy("RANDOM()")
        .limit(amount)
        .getMany();
        selected.forEach(supply => supply.picked = true);
        return await this.gameSupplyRepository.save(selected)
    }
    async getDrawnSupplies(gameId: number) {
        return await this.gameSupplyRepository
        .createQueryBuilder("game_supply")
        .leftJoinAndSelect("game_supply.supply", "supply")
        .where("game_supply.picked AND game_supply.gameId = :gameId", {gameId: gameId})
        .getMany();
    }
    async getDrawnSupply(gameId: number, supply: string) {
        const gameSupply = await this.gameSupplyRepository.findOne({
            where: {
                supplyName: supply,
                gameId: gameId,
                picked: true
            },
            relations: {supply: true},
        });
        return gameSupply;
    }

    async createGameSupply(gameSupply: CreateGameSupplyDto[]) {
        const newItem = this.gameSupplyRepository.create(gameSupply);
        return await this.gameSupplyRepository.save(newItem);
    }
}
