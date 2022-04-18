import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Character } from "./character.entity";
import { Game } from "./game.entity";

@Entity()
export class CharacterQueue {
    
    @PrimaryColumn()
    gameId: number;

    @PrimaryColumn()
    characterName: string;

    @Column()
    order: number;

    @ManyToOne(() => Game, (game) => game.queue)
    @JoinColumn({name: "gameId"})
    game: Game;

    @ManyToOne(() => Character, (character) => character.queue)
    @JoinColumn({name: "characterName"})
    character: Character;
}