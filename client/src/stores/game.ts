import { randomBytes } from 'crypto';
import { defineStore } from 'pinia';
import { Game, Player, Supply, Nav, FightRole } from '../interfaces/game';

export const useGameStore = defineStore("gameStoreID", {
    state: () => ({
        game: undefined as Game | undefined,
        playerSelf: undefined as Player | undefined,
        suppliesToPick: [] as Supply[],
        navsToPick: [] as Nav[],
        highlightedCardID: '',
        highlightedCardName: '',
        highlightedCardType: '',
        highlightedCardOwner: '',
    }),
    getters: {
        getFightRoleByChar: (state) => {
            return (charName: string) => state.game?.players.find((player) => player.character.name == charName)?.fighter
        },
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
        setNavPick(navs: Supply[]) {
            this.navsToPick = navs;
            console.log('picking supply', this.navsToPick);
        },
        clearPick() {
            this.suppliesToPick = [];
        },
        clearNavPick() {
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