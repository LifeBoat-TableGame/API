import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { stringify } from 'querystring';
import { CardsService } from 'src/cards/cards.service';
import { Character } from 'src/models/character.entity';
import { Navigation } from 'src/models/navigation.entity';

@Controller('chat')
export class ChatController {
    constructor(
        private cardsService: CardsService,
    ) {}


    @Get(':id')
    getChar(@Param('id') id): Promise<Navigation> {
    const nav = this.cardsService.getNavigation(id);
    return nav;
    }


}
