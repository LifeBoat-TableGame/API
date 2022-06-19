import { randomBytes } from 'crypto';
import { defineStore } from 'pinia';
import { Game, Player, Supply, Navigation, FightRole, GameState } from '../interfaces/game';

export const useGameStore = defineStore("gameStoreID", {
    state: () => ({
        game: {} as Game,
        playerSelf: {} as Player,
        suppliesToPick: [] as Supply[],
        navsToPick: [] as Navigation[],
        highlightedCardID: '',
        highlightedCardName: '',
        highlightedCardType: '',
        highlightedCardOwner: '',
        sideChosen: false,
    }),
    getters: {
        getFightRoleByChar: (state) => {
            return (charName: string) => state.game?.players.find((player) => player.character.name == charName)?.fighter
        },
        getCurrentChar: (state) => {
            try {
                const name = state.game.queue[state.game.currentCharacterIndex].character.name;
                return name;
              } catch (e) {
                return 'nooneIG'
              }
        },
        getPlayerByChar: (state) => {
            return (charName: string) => state.game?.players.find((player) => player.character.name == charName)
        },
    },
    actions: {
        changeHighlight(newUUID: string, type:string, name:string, owner:string) {
            this.highlightedCardName = name;
            this.highlightedCardID = newUUID;
            this.highlightedCardType = type;
            this.highlightedCardOwner = owner;
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
        setNavPick(navs: Navigation[]) {
            this.navsToPick = navs;
            console.log('picking nav', this.navsToPick);
        },
        clearPick() {
            this.suppliesToPick = [];
        },
        clearNavPick() {
            this.navsToPick = [];
        },
        setGame(game: any) {
            if (this.game != game)
                this.game = game;
            if (game.state != GameState.Fight) this.sideChosen = false;
        },
        setPlayer(player: Player) {
            if (this.playerSelf != player)
                this.playerSelf = player;
            if (player.fighter!=FightRole.Neutral) this.sideChosen = true;
        }
    }
});