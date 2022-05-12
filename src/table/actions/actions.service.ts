import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { TableService } from '../table.service';
import { Player } from '../../models/player.entity';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';
import { Supply } from '../../models/supply.entity';
import { Game, GameState } from '../../models/game.entity';
import { DisputeService } from '../dispute/dispute.service';
import { DisputeType } from '../../models/dispute.entity';
import { CharacterQueue } from '../../models/characterQueue.entity';
import { CardsService } from '../../cards/cards.service';
import { GameService } from '../../game/game.service';
import { FightService } from '../fight/fight.service';

@Injectable()
export class ActionsService {

    constructor (
        @Inject(UserService) private userService: UserService,
        @Inject(TableService) private tableService: TableService,
        @Inject(GameService) private gameService: GameService,
        @Inject(DisputeService) private disputeService: DisputeService,
        @Inject(CardsService) private cardsService: CardsService,
        @Inject(FightService) private fightService: FightService,
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
        const p1 = this.tableService.pickNavigation(game, nav);
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
            type: DisputeType.Swap,
            queueIndex: game.currentCharacterIndex
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
            type: DisputeType.Get,
            queueIndex: game.currentCharacterIndex
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
            type: DisputeType.Get,
            queueIndex: game.currentCharacterIndex
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
        //starting a fight
        await this.fightService.startFight(dispute.initiator, dispute.victim, dispute.game);
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