import { Column, Entity, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lobby } from "./lobby.entity";
import { Player } from "./player.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => Player, (player) => player.user)
    player: Player;

    @ManyToOne(() => Lobby, (lobby) => lobby.users)
    lobby: Lobby;

    @Column({unique: true})
    token: string;

    @Column({default: 'noname'})
    username: string;
}