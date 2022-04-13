import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Player } from "./player.entity";
import { Supply } from "./supply.entity";

@Entity()
export class Hand {

    @PrimaryColumn()
    playerId: string;

    @OneToOne(() => Player, (player) => player.hand)
    @JoinColumn({name: "playerId"})
    player: Player;

    @ManyToMany(() => Supply)
    @JoinTable()
    openCards: Supply[];

    @ManyToMany(() => Supply)
    @JoinTable()
    closedCards: Supply[];
}