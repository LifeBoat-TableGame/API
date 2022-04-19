import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { CharacterQueue } from "./characterQueue.entity";
import { Player } from "./player.entity";

@Entity('character')
export class Character {
    @PrimaryColumn()
    name: string;

    @Column()
    strength: number;

    @Column()
    survival: number;

    @Column()
    description: string;

    @Column({unique: true})
    defaultOrder: number;

    @OneToMany(() => CharacterQueue, (queue) => queue.character)
    queue: CharacterQueue;

    @OneToMany(() => Player, (player) => player.character)
    players: Player[];

    @OneToMany(() => Player, (player) => player.enemy)
    enemies: Player[];
    
    @OneToMany(() => Player, (player) => player.friendship)
    friends: Player[];
    
}