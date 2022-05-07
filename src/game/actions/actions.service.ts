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
import { CardsService } from '../../cards/cards.service';
import { throws } from 'assert';

@Injectable()
export class ActionsService {

    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(GameService) private gameService: GameService,
        @Inject(DisputeService) private disputeService: DisputeService,
        @Inject(CardsService) private cardsService: CardsService,
        @InjectRepository(Player) private playerRepository: Repository<Player>,
        @InjectRepository(CharacterQueue) private characterQueueRepository: Repository<CharacterQueue>,
        @InjectRepository(Game) private gameRepository: Repository<Game>
    ) {}

    async useSupply(player: Player, supplyName: string, targetName?: string){
        if (!this.userService.isConscious(player)){
            throw new WsException('You must be conscious to use supply');
        }
        let supply = player.openCards.find(supply => supply.name == supplyName);
        if(!supply){
            supply = player.closedCards.find(supply => supply.name == supplyName);
            if (!supply){
                throw new WsException("Couldn't find opened supply named " + supplyName);
            } else if (supply.name != "Зонтик") {
                throw new WsException("This supply should be opened to be used");
            }
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
            case "Сигнальный пистолет":
                await this.useFlareGun(player, supply);
                break;
            case "Зонтик":
                await this.useParasol(player, supply);
                break;
            case "Вода":
                await this.useWater(player, supply, target); 
        }

    }

    async useMedkit(supplyUser: Player, supply: Supply, target?: Player){
        if(supplyUser.game.state != GameState.Regular){
            throw new WsException("Gamestate should be regular");
        }
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

    async useFlareGun(supplyUser: Player, supply: Supply){
        if(supplyUser.game.state != GameState.Regular){
            throw new WsException("Gamestate should be regular");
        }
        const game = await this.gameService.getGameWithrelations(supplyUser.game.id);

        let nav = await this.cardsService.drawNavigation(3, supplyUser.game.id);
        console.log(nav);
        let seagulls = game.seagulls;
        for(const element of nav){
            seagulls += (await this.cardsService.getNavigation(element.navigationId)).seagul;
        }
        await this.gameRepository.update({id: supplyUser.game.id}, {seagulls: seagulls});
        await this.cardsService.removeDrawnNavigation(supplyUser.game.id);
        supplyUser.openCards.splice(supplyUser.openCards.indexOf(supply), 1);
        await this.playerRepository.save(supplyUser);
    }

    async useParasol(supplyUser: Player, supply: Supply){
        if(supplyUser.game.state != GameState.Regular){
            throw new WsException("Gamestate should be regular");
        }
        const toOpen = supplyUser.closedCards.splice(supplyUser.closedCards.indexOf(supply), 1);
        supplyUser.openCards.push(toOpen[0]);
        await this.playerRepository.save(supplyUser);
        
    }

    async useWater(supplyUser: Player, supply: Supply, target?: Player){
        if(supplyUser.game.state != GameState.NavigationPicked){
            throw new WsException("Gamestate should be NavigationPicked");
        }
        if(!target){
            throw new WsException("Water must have a target");
        }
        if(!this.userService.isAlive(target)){
            throw new WsException("Target must be alive");
        }
        if (target.thirst > 0){
            if(target.id == supplyUser.id){
                supplyUser.thirst--;
                supplyUser.openCards.splice(supplyUser.openCards.indexOf(supply), 1);
                await this.playerRepository.save(supplyUser);
            } else {
                target.thirst--;
                supplyUser.openCards.splice(supplyUser.openCards.indexOf(supply), 1);
                await this.playerRepository.save(target);
                await this.playerRepository.save(supplyUser);
            }
        } else {
            throw new WsException("Target is not thirsty");
        }
    }

    async row(player: Player, game: Game) {
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex);
        if(player.character.name != currentCharacter.characterName)
            throw new WsException("Not your turn");
        const cardsAmount = 2;
        const p1 = this.cardsService.drawNavigation(2, game.id);
        const p2 = this.gameService.updateGameState(game, GameState.Picking);
        await p1;
        await p2;
        const navigations = await this.cardsService.getDrawnNavigation(game.id);
        return navigations.map(nav => nav.navigation);
    }

    async pickNavigation(player: Player, game: Game, id: number) {
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex);
        if(player.character.name != currentCharacter.characterName)
            throw new WsException("Not your turn");
        if(game.state != GameState.Picking)
            throw new WsException("Action is not allowed during current phase");
        const nav = await this.cardsService.gameNavigationById(game.id, id);
        if(!nav) 
            throw new WsException("Card does not exist");
        const p1 = this.gameService.pickNavigation(game, nav);
        const p2 = this.gameService.gameTurn(game, GameState.Regular);
        await p1;
        await p2;
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
        await this.disputeService.startDispute({
            game: game,
            initiator: player,
            victim: target,
            type: DisputeType.Swap
        }, async () => {
            const p1 = this.gameService.updateGameState(game, GameState.Regular);
            const p2 = this.gameService.gameTurn(game);
            await p1;
            await p2;
        });
        await this.gameService.updateGameState(game, GameState.Dispute);
    }

    async requestClosedSupply(player: Player, game: Game, targetName: string) {
        const target = game.players.find(p => p.character.name == targetName);
        console.log(targetName);
        if(!target)
            throw new WsException("Character does not exists in the game");
        if(game.state != GameState.Regular)
            throw new WsException("Action is not allowed during current phase");
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex);
        if(player.character.name != currentCharacter.characterName)
            throw new WsException("Not your turn");
        if(target.closedCards.length < 1)
            throw new WsException("Target has no closed cards");
        await this.disputeService.startDispute({
            game: game,
            initiator: player,
            victim: target,
            type: DisputeType.Get
        }, async () => {
            const p1 = this.gameService.updateGameState(game, GameState.Regular);
            const p2 = this.gameService.gameTurn(game);
            await p1;
            await p2;
        });
        await this.gameService.updateGameState(game, GameState.Dispute);
    }

    async requestOpenSupply(player: Player, game: Game, targetName: string, supplyName: string) {
        const target = game.players.find(p => p.character.name == targetName);
        if(!target)
            throw new WsException("Character does not exists in the game");
        if(game.state != GameState.Regular)
            throw new WsException("Action is not allowed during current phase");
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex);
        if(player.character.name != currentCharacter.characterName)
            throw new WsException("Not your turn");
        const supply = target.openCards.find(card => card.name == supplyName);
        if(!supply)
            throw new WsException("Target has no supply with this name");
        await this.disputeService.startDispute({
            game: game,
            initiator: player,
            victim: target,
            target: supply,
            type: DisputeType.Get
        }, async () => {
            const p1 = this.gameService.updateGameState(game, GameState.Regular);
            const p2 = this.gameService.gameTurn(game);
            await p1;
            await p2;
        });
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
        //giving up on issue
        await this.disputeService.executeDispute(dispute);
    }
}