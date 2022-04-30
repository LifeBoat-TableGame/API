import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from '../../models/dispute.entity';
import { CreateDisputeDto, CreateOpenSupplyDisputeDto } from '../dto/createDisputeDto';

@Injectable()
export class DisputeService {
    constructor(@InjectRepository(Dispute) private disputeRepository: Repository<Dispute>) {}

    async create(disputeDto: CreateDisputeDto | CreateOpenSupplyDisputeDto) {
        const dispute = this.disputeRepository.create(disputeDto);
        return await this.disputeRepository.save(dispute);
    }

    async get(gameId: number) {
        return await this.disputeRepository.findOne({
            where: {
                gameId: gameId
            }, 
            relations: {
                initiator: {
                    character: true,
                },
                victim: {
                    character: true,
                },
                target: true,
                game: {
                    queue: true,
                }
            }});
    }
    async remove(gameId: number) {
        await this.disputeRepository.delete({gameId: gameId})
    }
}
