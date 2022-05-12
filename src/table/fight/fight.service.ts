import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { GameService } from '../../game/game.service';
import { Game, GameState } from '../../models/game.entity';
import { FightRole, Player } from '../../models/player.entity';
import { UserService } from '../../user/user.service';
import { DisputeService } from '../dispute/dispute.service';

@Injectable()
export class FightService {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(GameService) private gameService: GameService,
        @Inject(DisputeService) private disputeService: DisputeService
    ) {}

    async startFight(initiator: Player, victim: Player, game: Game) {
        const firstNeutralIndex = this.nextNeutralCharacter(game, 0, [
            initiator.character.name,
            victim.character.name
        ]);
        const promises = [
            this.userService.updatePlayerFightRole(initiator, FightRole.Atacker),
            this.userService.updatePlayerFightRole(victim, FightRole.Defender),
            this.gameService.updateGameState(game, GameState.Fight, firstNeutralIndex)
        ];
        await Promise.all(promises);
    }

    async joinFight(player: Player, role: FightRole) {
        if(player.game.state != GameState.Fight)
            throw new WsException("There is no fight to join");
        if(player.fighter != FightRole.Neutral)
            throw new WsException("You are already in a fight");
        await this.userService.updatePlayerFightRole(player, role);
    }

    async finishFight(game: Game, currentIndex: number) {
        const atackers = [];
        const defenders = [];
        let atackStrength = 0;
        let defenderStrength = 0;
        game.players.forEach(player => {
            if(player.fighter == FightRole.Atacker) {
                atackers.push(player);
                atackStrength += this.playerStrength(player);
            }
            if(player.fighter == FightRole.Defender) {
                defenders.push(player);
                defenderStrength += this.playerStrength(player);
            }
        });
        const win = atackStrength > defenderStrength;
        const promises = [
            this.userService.updateFighters(atackers, !win),
            this.userService.updateFighters(defenders, win),
            this.gameService.updateGameState(game, GameState.Regular, currentIndex),
        ];
        await Promise.all(promises);
        return win;
    }

    async fightTurn(game: Game) {
        const nextNeutralIndex = this.nextNeutralCharacter(game, game.currentCharacterIndex + 1);
        if(game.isLast || nextNeutralIndex == null) {
            const dispute = await this.disputeService.get(game.id);
            const win = await this.finishFight(game, dispute.queueIndex);
            if(win) await this.disputeService.executeDispute(dispute);
            else await this.disputeService.remove(game.id);
            const newGame = await this.gameService.getGameWithrelations(game.id);
            await this.gameService.gameTurn(newGame);
        } else {
            await this.gameService.updateGameState(game, nextNeutralIndex, GameState.Fight);
        }
            
    }

    private nextNeutralCharacter(game: Game, startIndex: number, exclude: string[] = []): number | null {
        for(let i = startIndex; i < game.queue.length; i++) {
            const character = game.queue.find(p => p.order == i).characterName;
            if(exclude.includes(character)) continue;
            const player = game.players.find(p => p.character.name == character);
            if(player.fighter == FightRole.Neutral)
                return i;
        }
        return null;
    }

    private playerStrength(player: Player) {
        let count = player.character.strength;
        player.openCards.forEach(card => count += card.strength ?? 0);
        return count;
    }
}
