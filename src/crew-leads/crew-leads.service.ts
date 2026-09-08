import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CrewLeadEntity } from '../infrastructure/entities/crew-lead.entity.js';
import { MAX_CREW_LEADS } from '../domain/crew-lead.js';

const CREW_LEAD_LOCK_KEY = 727272; // arbitrary constant identifying this lock

@Injectable()
export class CrewLeadsService {
  constructor(
    @InjectRepository(CrewLeadEntity)
    private readonly crewLeadRepo: Repository<CrewLeadEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(name: string): Promise<CrewLeadEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Serializes concurrent creation attempts against this exact invariant
      await queryRunner.query('SELECT pg_advisory_xact_lock($1)', [CREW_LEAD_LOCK_KEY]);

      const count = await queryRunner.manager.count(CrewLeadEntity);
      if (count >= MAX_CREW_LEADS) {
        throw new ConflictException(
          `Cannot create Crew Lead: exactly ${MAX_CREW_LEADS} are allowed and the limit has been reached.`,
        );
      }

      const crewLead = queryRunner.manager.create(CrewLeadEntity, { name });
      const saved = await queryRunner.manager.save(crewLead);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<CrewLeadEntity[]> {
    return this.crewLeadRepo.find();
  }
}