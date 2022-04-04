import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({unique: true})
    token: string;

    @Column({default: 'noname'})
    username: string;
}