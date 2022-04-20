import { Injectable } from '@nestjs/common';
import { Game } from '../../models/game.entity';
import {Server, Socket} from 'socket.io';
import { Player } from '../../models/player.entity';

@Injectable()
export class NotificationService {
    constructor() {}

    private limitPlayer(player: Player) {
        if(player.closedCards) player.closedAmount = player.closedCards.length;
        else player.closedAmount = 0;
        delete player.closedCards;
        delete player.user;
        delete player.enemy;
        delete player.friendship;
    }

    async startGame(game: Game, lobbyId: string, wss: Server) {
        const sockets = await wss.in(lobbyId).fetchSockets();
        game.players.forEach( player => {
            const token = player.user.token;
            const socket = sockets.find(client => client.handshake.headers.authorization == token);
            socket.emit('playerInfo', player);
            this.limitPlayer(player);
        });
        wss.in(lobbyId).emit('gameStarted', game);
    }

    gameInfo(game: Game, client: Socket) {
        game.players.forEach(player => {
            this.limitPlayer(player);
        });
        client.emit('gameInfo', game);
    }
}
