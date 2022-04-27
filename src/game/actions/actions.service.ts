import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { GameService } from '../../game/game.service';
import { Player } from '../../models/player.entity';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ActionsService {

    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(GameService) private gameService: GameService,
        @InjectRepository(Player) private playerRepository: Repository<Player>
    ) {}

    async useSupply(token: string, supplyName: string, targetName: string){
        const user = await this.userService.getWithRelations(token);
        console.log(user);
        const player = await this.userService.getPlayerRelations(user.player.id);
        if (!this.userService.isConscious(player)){
            throw new WsException('You must be conscious to use supply');
        }
        var foundSupply = false;
        player.openCards.forEach(element => {
            if(element.name == supplyName){
                foundSupply = true;
                return;
            }
        });
        if(!foundSupply){
            console.log(supplyName);
            console.log(targetName);
            throw new WsException("Couldn't find opened supply named " + supplyName);
        }
        if (targetName != null){
            var targetPlayer;
            const game = await this.gameService.getGameWithrelations(player.game.id);
            game.players.forEach(element => {
                if(element.character.name == targetName){
                    targetPlayer = element;
                    return;
                }
            });
            if (targetPlayer == null){
                throw new WsException("Couldn't find target named" + targetName);
            }
        }
        switch(supplyName){
            case "Аптечка":
                this.useMedkit(player, supplyName, targetPlayer);
                break;
        }

    }

    async useMedkit(supplyUser: Player, supplyName: string, target: Player){
        if(!this.userService.isAlive(target)){
            throw new WsException("Target must be alive");
        }
        if(target.damage >= 1){
            target.damage --;
            var opened = supplyUser.openCards;
            opened.forEach(function(value, index){
                if (value.name == supplyName){
                    opened.splice(index, 1);
                    return;
                }
            });
            supplyUser.openCards = opened;
            await this.playerRepository.save(supplyUser);
            await this.playerRepository.save(target);

        } else {
            throw new WsException("Can't use Medkit on target with full health");
        }

    }
}

