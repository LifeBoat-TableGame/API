import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";
import { Game } from "./game.entity";
import { User } from "./user.entity";

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User, (user) => user.player)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Game, (game) => game.players)
    game: Game;

    @OneToOne(() => Character)
    @JoinColumn()
    character: Character;

    @OneToOne(() => Character)
    @JoinColumn()
    friendship: Character;

    @OneToOne(() => Character)
    @JoinColumn()
    enemy: Character;

    @Column({default: 0})
    damage: number;

    @Column({default: false})
    rowed: boolean;

    @Column({default: false})
    fought: boolean;

    @Column({default: false})
    Thirst: boolean;

}