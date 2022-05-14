import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";
import { Game } from "./game.entity";
import { Supply } from "./supply.entity";
import { User } from "./user.entity";

export enum FightRole {
    Atacker = 'Atack',
    Defender = 'Defend',
    Neutral = 'Neutral',
}

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User, (user) => user.player)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Game, (game) => game.players)
    @JoinColumn()
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
    
    closedAmount: number;

    @ManyToMany(() => Supply)
    @JoinTable()
    closedCards: Supply[];

    @ManyToMany(() => Supply)
    @JoinTable()
    openCards: Supply[];

    @Column({default: FightRole.Neutral})
    fighter: FightRole;

    @Column({default: 0})
    damage: number;

    @Column({default: false})
    rowed: boolean;

    @Column({default: false})
    fought: boolean;

    @Column({default: 0})
    thirst: number;

}