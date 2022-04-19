import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { GameSupply } from "./gameSupply.entity";

@Entity('supply')
export class Supply {
    @PrimaryColumn()
    name: string;

    @Column({nullable: true})
    strength: number;

    @Column({nullable: true})
    bonus: number;

    @Column()
    description: string;

    @Column()
    amount: number;

    @OneToMany(() => GameSupply, (gameSupply) => gameSupply.supply)
    gameConnection: GameSupply;
}