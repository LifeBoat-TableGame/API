import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";

@Entity('navigation')
export class Navigation{

    @PrimaryGeneratedColumn()
    id?: number

    @ManyToMany(() => Character)
    @JoinTable()
    charactersOverboard: Character[]

    @Column()
    seagul: number

    @ManyToMany(() => Character)
    @JoinTable()
    charactersThirst: Character[]

    @Column()
    fight: boolean

    @Column()
    oar: boolean
}