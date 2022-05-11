import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { GameService } from '../../game/game.service';
import { Game, GameState } from '../../models/game.entity';
import { FightRole, Player } from '../../models/player.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class FightService {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(GameService) private gameService: GameService
    ) {}

    async startFight(initiator: Player, victim: Player, game: Game) {
        const promises = [
            this.userService.updatePlayerFightRole(initiator, FightRole.Atacker),
            this.userService.updatePlayerFightRole(victim, FightRole.Defender),
            this.gameService.updateGameState(game, GameState.Fight)
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

    async finishFight(game: Game) {
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
            this.gameService.updateGameState(game, GameState.Regular),
        ];
        await Promise.all(promises);
        return win;
    }

    private playerStrength(player: Player) {
        let count = player.character.strength;
        player.openCards.forEach(card => count += card.strength ?? 0);
        return count;
    }
}
