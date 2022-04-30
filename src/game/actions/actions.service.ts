import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { GameService } from '../../game/game.service';
import { Player } from '../../models/player.entity';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';
import { Supply } from '../../models/supply.entity';
import { Game, GameState } from '../../models/game.entity';
import { DisputeService } from '../dispute/dispute.service';
import { DisputeType } from '../../models/dispute.entity';
import { CharacterQueue } from '../../models/characterQueue.entity';

@Injectable()
export class ActionsService {

    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(GameService) private gameService: GameService,
        @Inject(DisputeService) private disputeService: DisputeService,
        @InjectRepository(Player) private playerRepository: Repository<Player>,
        @InjectRepository(CharacterQueue) private characterQueueRepository: Repository<CharacterQueue>
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

    async requestSwap(player: Player, game: Game, targetName: string) {
        const target = game.players.find(p => p.character.name == targetName);
        if(!target)
            throw new WsException("Character does not exists in the game");
        if(game.state != GameState.Regular)
            throw new WsException("Action is not allowed during current phase");
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex);
        if(player.character.name != currentCharacter.characterName)
            throw new WsException("Not your turn");
        const dispute = await this.disputeService.create({
            game: game,
            initiator: player,
            victim: target,
            type: DisputeType.Swap
        });
        let timeToWait = 10;
        const interval = setInterval(async () => {
            timeToWait--;
            console.log(`${timeToWait} seconds remains`);
            if(timeToWait == 0) {
                clearInterval(interval);
                const dispute = await this.disputeService.get(game.id);
                if(dispute) {
                    //give up on dispute
                    if(dispute.game.state != GameState.Dispute) return;
                    //forcing swap
                    if(dispute.type == DisputeType.Swap) {
                        await this.characterQueueRepository.update({gameId: dispute.gameId, characterName: dispute.initiator.character.name}, {
                            newOrder: dispute.game.queue.find(p => p.characterName == dispute.victim.character.name).order
                        });
                        await this.characterQueueRepository.update({gameId: dispute.gameId, characterName: dispute.victim.character.name}, {
                            newOrder: dispute.game.queue.find(p => p.characterName == dispute.initiator.character.name).order
                        });
                    }
                    
                } else console.log("dispute rspolved");
            }
        }, 1000);
        await this.gameService.updateGameState(game, GameState.Dispute);
    }

    async declineDispute(player: Player) {
        if(player.game.state != GameState.Dispute)
            throw new WsException("Action is not allowed during current phase");
        const dispute = await this.disputeService.get(player.game.id);
        if(dispute.victim.id != player.id)
            throw new WsException("You are not in a dispute");
        await this.disputeService.remove(player.game.id);
        //starting a fight
        await this.gameService.updateGameState(dispute.game, GameState.Fight);
        console.log('fight started');
    }

    async acceptDispute(player: Player) {
        if(player.game.state != GameState.Dispute)
            throw new WsException("Action is not allowed during current phase");
        const dispute = await this.disputeService.get(player.game.id);
        if(dispute.victim.id != player.id)
            throw new WsException("You are not in a dispute");
        await this.gameService.updateGameState(player.game, GameState.Regular);
        await this.disputeService.remove(player.game.id);
        //giving up on issue
        if(dispute.type == DisputeType.Swap) {
            await this.characterQueueRepository.update({gameId: dispute.gameId, characterName: dispute.initiator.character.name}, {
                newOrder: dispute.game.queue.find(p => p.characterName == dispute.victim.character.name).order
            });
            await this.characterQueueRepository.update({gameId: dispute.gameId, characterName: dispute.victim.character.name}, {
                newOrder: dispute.game.queue.find(p => p.characterName == dispute.initiator.character.name).order
            });
            
        }
    }
}