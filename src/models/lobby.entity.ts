import { AfterLoad, Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Lobby {

    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column()
    name?: string;

    @OneToMany(() => User, (user) => user.lobby)
    users: User[];

    usersCount: number;
    
    @Column({default: 4})
    limit: number;

    @Column({nullable: true})
    password: string;

    @OneToOne(() => User)
    @JoinColumn()
    creator: User;

}