import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CharacterQueue } from "./characterQueue.entity";
import { GameNavigation } from "./gameNavigation.entity";
import { GameSupply } from "./gameSupply.entity";
import { Navigation } from "./navigation.entity";
import { Player } from "./player.entity";

export enum GameState {
    Supplies = 1,
    Regular = 2,
    Dispute = 3,
    Fight = 4,
    Picking = 5,
    NavigationPicked = 6
}

@Entity()
export class Game {
    
    @PrimaryGeneratedColumn()
    id?: number;

    @OneToMany(() => Player, (player) => player.game)
    players: Player[];

    @OneToMany(() => GameSupply, (gameSupply) => gameSupply.game)
    supplyDeck: GameSupply[];

    @OneToMany(() => GameNavigation, (gameNavigation) => gameNavigation.game)
    navigationDeck: GameNavigation[];

    @OneToMany(() => GameNavigation, (gameNavigation) => gameNavigation.chosenIn)
    chosenNavigationDeck: GameNavigation[];
    
    chosenNavigationCount: number;

    @Column()
    state: GameState;

    @OneToMany(() => CharacterQueue, (queue) => queue.game)
    queue: CharacterQueue[];

    @Column({default: 0})
    currentCharacterIndex: number;

    @Column({default: 0})
    seagulls: number;

    public get isLast(): boolean {
        return this.currentCharacterIndex >= this.players.length - 1;
    }
}