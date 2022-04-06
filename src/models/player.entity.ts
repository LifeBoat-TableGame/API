import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";
import { User } from "./user.entity";

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User, (user) => user.player)
    @JoinColumn()
    user: User;

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