import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { GameService } from '../../game/game.service';
import { Player } from '../../models/player.entity';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';
import { Supply } from '../../models/supply.entity';

@Injectable()
export class ActionsService {

    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(GameService) private gameService: GameService,
        @InjectRepository(Player) private playerRepository: Repository<Player>
    ) {}

    async useSupply(player: Player, supplyName: string, targetName?: string){
        if (!this.userService.isConscious(player)){
            throw new WsException('You must be conscious to use supply');
        }
        const supply = player.openCards.find(supply => supply.name == supplyName);
        if(!supply){
            throw new WsException("Couldn't find opened supply named " + supplyName);
        }
        let target: Player;
        if (targetName){
            const game = await this.gameService.getGameWithrelations(player.game.id);
            target = game.players.find(player => player.character.name == targetName);
            if (!target)
                throw new WsException("Couldn't find target named " + targetName);
        }
        switch(supplyName){
            case "Аптечка":
                await this.useMedkit(player, supply, target);
                break;
        }

    }

    async useMedkit(supplyUser: Player, supply: Supply, target?: Player){
        if(!target){
            throw new WsException("Medkit must have a target");
        }
        if(!this.userService.isAlive(target)){
            throw new WsException("Target must be alive");
        }
        if(target.damage >= 1){
            target.damage --;
            supplyUser.openCards.splice(supplyUser.openCards.indexOf(supply), 1);
            await this.playerRepository.save(target);
            await this.playerRepository.save(supplyUser);
            

        } else {
            throw new WsException("Can't use Medkit on target with full health");
        }

    }
}

