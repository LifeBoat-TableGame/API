import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../models/character.entity';

@Injectable()
export class CardsService {
    constructor(@InjectRepository(Character) private characterRepository: Repository<Character>) {}
    
    async getCharacter(name: string) {
        const character = this.characterRepository.findOne({
            where: { name }
        });
        return character;
    }

    async getAllCharacters() {
        return this.characterRepository.find();
    }
}
