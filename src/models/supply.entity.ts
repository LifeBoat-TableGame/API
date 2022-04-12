import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { GameSupply } from "./gameSupply.entity";

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

    @OneToMany(() => GameSupply, (gameSupply) => gameSupply.supply)
    gameConnection: GameSupply;
}