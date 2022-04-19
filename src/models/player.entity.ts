import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";
import { Game } from "./game.entity";
import { Hand } from "./hand.entity";
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

    @ManyToOne(() => Character, (character) => character.players)
    @JoinColumn()
    character: Character;

    @ManyToOne(() => Character, (character) => character.friends)
    @JoinColumn()
    friendship: Character;

    @ManyToOne(() => Character, (character) => character.enemies)
    @JoinColumn()
    enemy: Character;

    @OneToOne(() => Hand)
    hand: Hand;

    @Column({default: 0})
    damage: number;

    @Column({default: false})
    rowed: boolean;

    @Column({default: false})
    fought: boolean;

    @Column({default: false})
    Thirst: boolean;

}