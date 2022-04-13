import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character.entity";
import { GameNavigation } from "./gameNavigation.entity";

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

    @OneToMany(() => GameNavigation, (gameNavigation) => gameNavigation.navigation)
    gameConnection: GameNavigation;

}