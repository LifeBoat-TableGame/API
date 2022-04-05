import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";
import { User } from "./user.entity";

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id?: number;

    @OneToOne(() => User)
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

    @Column()
    damage: number;

    @Column()
    rowed: boolean;

    @Column()
    fought: boolean;

    @Column()
    Thirst: boolean;

}