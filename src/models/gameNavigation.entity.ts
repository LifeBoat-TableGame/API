import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Game } from "./game.entity";
import { Navigation } from "./navigation.entity";

@Entity()
export class GameNavigation {
    
    @PrimaryColumn()
    gameId: number;

    @PrimaryColumn()
    navigationId: number;

    @Generated('increment')
    @Column({unique: true})
    order: number;

    @ManyToOne(() => Game, (game) => game.navigationDeck)
    @JoinColumn({name: "gameId"})
    game: Game;

    @ManyToOne(() => Navigation, (navigation) => navigation.gameConnection)
    @JoinColumn({name: "navigationId"})
    navigation: Navigation
}