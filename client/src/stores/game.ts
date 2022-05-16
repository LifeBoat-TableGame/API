import { defineStore } from 'pinia';
import { Game, Player, Supply } from '../interfaces/game'
import { PropType } from 'vue';

export const useGameStore = defineStore("gameStoreID", {
    state: () => ({
        game: undefined as Game | undefined,
        playerSelf: undefined as Player | undefined,
        suppliesToPick: [] as Supply[],
    }),
    getters: {
    },
    actions: {
        setPick(supplies: Supply[]) {
            this.suppliesToPick = supplies;
            console.log('picking supply', this.suppliesToPick);
            return this.suppliesToPick;
        },
        clearPick() {
            this.suppliesToPick = [];
        },
        setGame(game: Game) {
            this.game = game;
            console.log('Game Object', game); 
            return this.game   ;       
        },
        setPlayer(player: Player) {
            this.playerSelf = player;
            console.log('Player Object', player); 
            return this.playerSelf;
        }
    }
});