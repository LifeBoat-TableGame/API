import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { CharacterQueue } from "./characterQueue.entity";

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

    @OneToMany(() => CharacterQueue, (queue) => queue.character)
    queue: CharacterQueue;
}