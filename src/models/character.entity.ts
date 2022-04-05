import { Column, Entity, PrimaryColumn } from "typeorm";

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
}