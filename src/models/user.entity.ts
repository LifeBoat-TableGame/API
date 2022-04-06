import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./player.entity";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => Player, (player) => player.user)
    player: Player;

    @Column({unique: true})
    token: string;

    @Column({default: 'noname'})
    username: string;
}