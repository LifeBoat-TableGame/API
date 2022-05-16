import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacterQueue } from 'src/models/characterQueue.entity';
import { GameState } from '../../models/game.entity';
import { Repository } from 'typeorm';
import { Dispute, DisputeType } from '../../models/dispute.entity';
import { CreateDisputeDto, CreateOpenSupplyDisputeDto } from '../dto/createDisputeDto';
import { UserService } from '../../user/user.service';

@Injectable()
export class DisputeService {
    constructor(
        @Inject(UserService) private userService: UserService,
        @InjectRepository(Dispute) private disputeRepository: Repository<Dispute>,
        @InjectRepository(CharacterQueue) private characterQueueRepository: Repository<CharacterQueue>
    ) {}

    async create(disputeDto: CreateDisputeDto | CreateOpenSupplyDisputeDto) {
        const dispute = this.disputeRepository.create(disputeDto);
        return await this.disputeRepository.save(dispute);
    }

    async startDispute(disputeDto: CreateDisputeDto | CreateOpenSupplyDisputeDto, callback: () => Promise<void>){
        await this.create(disputeDto);
        let timeToWait = 10;
        const interval = setInterval(async () => {
            timeToWait--;
            console.log(`${timeToWait} seconds remains`);
            if(timeToWait == 0) {
                clearInterval(interval);
                const dispute = await this.get(disputeDto.game.id);
                if(dispute) {
                    //give up on dispute
                    if(dispute.game.state != GameState.Dispute) return;
                    //forcing swap
                    await this.executeDispute(dispute);
                    await callback();
                } else console.log("dispute resolved");
            }
        }, 1000);
    }

    async executeDispute(dispute: Dispute) {
        await this.remove(dispute.gameId);
        if(dispute.type ==  DisputeType.Swap) {
            const initiatorQueue = dispute.game.queue.find(p => p.characterName == dispute.initiator.character.name);
            const victimQueue = dispute.game.queue.find(p => p.characterName == dispute.victim.character.name);
            const update1 = this.characterQueueRepository.update({gameId: dispute.gameId, characterName: dispute.initiator.character.name}, {
                newOrder: victimQueue.newOrder ?? victimQueue.order
            });
            const update2 = this.characterQueueRepository.update({gameId: dispute.gameId, characterName: dispute.victim.character.name}, {
                newOrder: initiatorQueue.newOrder ?? initiatorQueue.order
            });
            await update1;
            await update2;
        }
        else if(dispute.target) {
            const targetIndex = dispute.victim.openCards.findIndex( supply => supply.name == dispute.target.name);
            if(targetIndex < 0)
                return;
            dispute.victim.openCards.splice(targetIndex, 1);
            dispute.initiator.openCards.splice(0, 0, dispute.target);
            console.log(dispute.initiator.openCards);
        } 
        else {
            const supply = this.get_random(dispute.victim.closedCards);
            const targetIndex = dispute.victim.closedCards.findIndex( s => s.name == supply.name);
            if(targetIndex < 0)
                return;
            dispute.victim.closedCards.splice(targetIndex, 1);
            dispute.initiator.closedCards.splice(0, 0, supply);
        }
        if(dispute.type == DisputeType.Get) {
            const update1 = this.userService.updatePlayer(dispute.victim);
            const update2 = this.userService.updatePlayer(dispute.initiator);
            await update1;
            await update2;
        }
    }

    async get(gameId: number) {
        return await this.disputeRepository.findOne({
            where: {
                gameId: gameId
            }, 
            relations: {
                initiator: {
                    character: true,
                    openCards: true,
                    closedCards: true
                },
                victim: {
                    character: true,
                    openCards: true,
                    closedCards: true
                },
                target: true,
                game: {
                    queue: true,
                    players: {
                        character: true,
                    }
                }
            }});
    }
    async remove(gameId: number) {
        await this.disputeRepository.delete({gameId: gameId})
    }

    private get_random<T>(list: T[]) {
        return list[Math.floor((Math.random()*list.length))];
    }
}
