import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameSupply } from "./gameSupply.entity";
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

    @Column()
    state: GameState;

    @Column()
    seagulls: number;
}