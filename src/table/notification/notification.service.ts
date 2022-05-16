import { Injectable } from '@nestjs/common';
import { Game } from '../../models/game.entity';
import {Server, Socket} from 'socket.io';
import { Player } from '../../models/player.entity';
import { GameSupply } from '../../models/gameSupply.entity';

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
    private limitGame(game: Game) {
        game.chosenNavigationCount = game.chosenNavigationDeck ? game.chosenNavigationDeck.length : 0;
        delete game.chosenNavigationDeck;
    }

    async updateGame(game: Game, lobbyId: string, wss: Server) {
        const sockets = await wss.in(lobbyId).fetchSockets();
        game.players.forEach( player => {
            const token = player.user.token;
            const socket = sockets.find(client => client.handshake.headers.authorization == token);
            if(socket)
                socket.emit('playerInfo', player);
            this.limitPlayer(player);
        });
        this.limitGame(game);
        wss.in(lobbyId).emit('gameInfo', game);
    }

    gameInfo(game: Game, client: Socket) {
        game.players.forEach(player => {
            this.limitPlayer(player);
        });
        this.limitGame(game);
        client.emit('gameInfo', game);
    }
    async cardsToChoose(supplies: GameSupply[], game: Game, wss: Server, lobbyId: string) {
        const currentCharacter = game.queue.find(character => character.order == game.currentCharacterIndex).characterName;
        const currentPlayer =  game.players.find(player => player.character.name == currentCharacter);
        const clients = await wss.in(lobbyId).fetchSockets();
        const currentClient = clients.find(client => 
            client.handshake.headers.authorization == currentPlayer.user.token
        );
        currentClient.emit('toChoose', supplies.map(gameSupply => gameSupply.supply));
    }
}
