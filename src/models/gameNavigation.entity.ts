import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Game } from "./game.entity";
import { Navigation } from "./navigation.entity";

@Entity()
export class GameNavigation {
    
    @PrimaryColumn()
    gameId: number;

    @PrimaryColumn()
    navigationId: number;

    @Column()
    order: number;

    @Column({default: false})
    picked: boolean;

    @ManyToOne(() => Game, (game) => game.navigationDeck)
    @JoinColumn({name: "gameId"})
    game: Game;

    @ManyToOne(() => Game, (game) => game.chosenNavigationDeck)
    @JoinColumn()
    chosenIn: Game;

    @ManyToOne(() => Navigation, (navigation) => navigation.gameConnection)
    @JoinColumn({name: "navigationId"})
    navigation: Navigation
}