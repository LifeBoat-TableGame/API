import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Lobby {

    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column()
    name?: string;

    @OneToMany(() => User, (user) => user.lobby, {
        cascade: ['insert', 'remove']
    })
    users?: User[];

    @Column({default: 4})
    limit: number;

    @Column({nullable: true})
    password: string;

    @OneToOne(() => User, {
        cascade: ['insert']
    })
    @JoinColumn()
    creator: User;
}