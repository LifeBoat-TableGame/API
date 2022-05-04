
export interface Player {
    id: number;
    character: Character;
    friendship: Character;
    enemy: Character;
    closedCards: Supply[];
    openCards: Supply[];
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
export interface Supply {
    name: string;
    strength: number | null;
    bonus: number | null;
    description: string;
    amount: number;
};
export interface CharacterQueue {
    gameId: number;
    characterName: string;
    order: number;
    character: Character;
};
enum GameState {
    Supplies = 1,
    Regular = 2
};
export interface Game {
    players: Player[];
    queue: CharacterQueue[];
    state: GameState;
    currentCharacterIndex: number;
    seagulls: number;
};