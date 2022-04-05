import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('supply')
export class Supply {
    @PrimaryColumn()
    name: string;

    @Column()
    strength: number;

    @Column()
    bonus: number;

    @Column()
    description: string;
}