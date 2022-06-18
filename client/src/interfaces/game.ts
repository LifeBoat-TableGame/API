
export interface Player {
    id: number;
    character: Character;
    friendship: Character;
    enemy: Character;
    closedAmount: number;
    closedCards: Supply[];
    openCards: Supply[];
    fighter: FightRole,
    damage: number;
    rowed: boolean;
    fought: boolean;
    Thirst: boolean;
};
export interface Character {
    name: string;
    strength: number;
    survival: number;
    description: string;
    defaultOrder: number;
};
export interface PopupOption {
    name: string;
    text: string;
    id: number | null;
};
export interface Supply {
    name: string;
    strength: number | null;
    bonus: number | null;
    description: string;
    amount: number;
};
export interface Nav {
    name: string;
    description: string;
};
export interface CharacterQueue {
    gameId: number;
    characterName: string;
    order: number;
    character: Character;
};
export enum GameState {
    Supplies = 1,
    Regular = 2,
    Dispute = 3,
    Fight = 4,
    Picking = 5,
    NavigationPicked = 6
};
export enum FightRole {
    Atacker = 'Atacker',
    Defender = 'Defender',
    Neutral = 'Neutral'
};
export interface Game {
    players: Player[];
    queue: CharacterQueue[];
    state: GameState;
    currentCharacterIndex: number;
    seagulls: number;
};