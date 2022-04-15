import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameNavigation } from "./gameNavigation.entity";
import { GameSupply } from "./gameSupply.entity";
import { Navigation } from "./navigation.entity";
import { Player } from "./player.entity";

export enum GameState {
    Supplies = 1,
    Regular = 2
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

    @ManyToMany(() => Navigation)
    @JoinTable()
    chosenNavigationDeck: Navigation[];

    @Column()
    state: GameState;

    @Column({default: 0})
    seagulls: number;
}