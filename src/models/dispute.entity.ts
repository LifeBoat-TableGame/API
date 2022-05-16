import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Game } from "./game.entity";
import { GameSupply } from "./gameSupply.entity";
import { Player } from "./player.entity";
import { Supply } from "./supply.entity";

export enum DisputeType {
    Swap = 1,
    Get = 2
}

@Entity()
export class Dispute {
    
    @PrimaryColumn()
    gameId: number;

    @OneToOne(() => Game)
    @JoinColumn({name: "gameId"})
    game: Game;

    @OneToOne(() => Player)
    @JoinColumn()
    initiator: Player;

    @OneToOne(() => Player)
    @JoinColumn()
    victim: Player;

    @ManyToOne(() => Supply)
    @JoinColumn()
    target: Supply

    @Column()
    type: DisputeType
    
    @Column()
    queueIndex: number;
}