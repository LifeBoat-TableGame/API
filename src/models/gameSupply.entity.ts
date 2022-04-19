import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";
import { Supply } from "./supply.entity";

@Entity()
export class GameSupply {

    @PrimaryGeneratedColumn()
    id?: number;
    
    @PrimaryColumn()
    gameId: number;

    @PrimaryColumn()
    supplyName: string;

    @Generated('increment')
    @Column({unique: true})
    order: number;

    @Column({default: false})
    picked: boolean;

    @ManyToOne(() => Game, (game) => game.supplyDeck)
    @JoinColumn({name: "gameId"})
    game: Game;

    @ManyToOne(() => Supply, (supply) => supply.gameConnection)
    @JoinColumn({name: "supplyName"})
    supply: Supply
}