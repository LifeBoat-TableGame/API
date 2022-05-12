import { defineStore } from 'pinia';
import { Game, Player } from '../interfaces/game'
import { PropType } from 'vue';

export const useGameStore = defineStore("gameStoreID", {
    state: () => ({
        game: undefined as Game | undefined,
        playerSelf: undefined as Player | undefined,
    }),
    getters: {
    },
    actions: {
        setGame(game: Game) {
            this.game = game;
            console.log('Game Object', game);           
        },
        setPlayer(player: Player) {
            this.playerSelf = player;
            console.log('Player Object', player); 
        }
    }
});