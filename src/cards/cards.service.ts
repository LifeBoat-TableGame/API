import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supply } from '../models/supply.entity';
import { Repository } from 'typeorm';
import { Character } from '../models/character.entity';
import { Navigation } from 'src/models/navigation.entity';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Character) private characterRepository: Repository<Character>, 
        @InjectRepository(Supply) private supplyRepository: Repository<Supply>,
        @InjectRepository(Navigation) private navigationRepository: Repository<Navigation>
        ) {}
    
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

    async getAllCharacters() {
        return this.characterRepository.find();
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
}
