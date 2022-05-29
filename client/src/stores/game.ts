import { defineStore } from 'pinia';
import { Game, Player, Supply } from '../interfaces/game'
import Card from './Card.vue';
import { PropType } from 'vue';

export const useGameStore = defineStore("gameStoreID", {
    state: () => ({
        game: undefined as Game | undefined,
        playerSelf: undefined as Player | undefined,
        suppliesToPick: [] as Supply[],
        highlightedCardID: '',
        highlightedCardName: '',
        highlightedCardType: '',
        highlightedCardOwner: '',
    }),
    getters: {
    },
    actions: {
        changeHighlight(newUUID: string, type:string, name:string, owner:string) {
            this.highlightedCardName = name;
            this.highlightedCardID = newUUID;
            this.highlightedCardType = type;
            this.highlightedCardOwner = owner;
            console.log(this.highlightedCardName, this.highlightedCardType, this.highlightedCardOwner);
        },
        clearHighlight() {
            this.highlightedCardName = '';
            this.highlightedCardType = '';
            this.highlightedCardID = '';
            this.highlightedCardOwner = '';
        },
        setPick(supplies: Supply[]) {
            this.suppliesToPick = supplies;
            console.log('picking supply', this.suppliesToPick);
        },
        clearPick() {
            this.suppliesToPick = [];
        },
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