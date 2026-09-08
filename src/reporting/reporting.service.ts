import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsageRecordEntity } from '../infrastructure/entities/usage-record.entity.js';
import { PassengerEntity } from '../infrastructure/entities/passenger.entity.js';
import { ResourceEntity } from '../infrastructure/entities/resource.entity.js';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(UsageRecordEntity) private readonly usageRepo: Repository<UsageRecordEntity>,
  ) {}

  personalHistory(passengerId: string): Promise<UsageRecordEntity[]> {
    return this.usageRepo.find({ where: { passengerId }, order: { usedAt: 'DESC' } });
  }

  async usageByMembershipLevel() {
    const raw = await this.usageRepo
      .createQueryBuilder('usage')
      .innerJoin(PassengerEntity, 'passenger', 'passenger.id = usage.passengerId')
      .select('passenger.membershipLevel', 'membershipLevel')
      .addSelect('COUNT(usage.id)', 'usageCount')
      .groupBy('passenger.membershipLevel')
      .orderBy('passenger.membershipLevel', 'ASC')
      .getRawMany();

    return raw.map((r) => ({ membershipLevel: Number(r.membershipLevel), usageCount: Number(r.usageCount) }));
  }

  async highDemandResources() {
    const raw = await this.usageRepo
      .createQueryBuilder('usage')
      .innerJoin(ResourceEntity, 'resource', 'resource.id = usage.resourceId')
      .select('resource.id', 'resourceId')
      .addSelect('resource.name', 'name')
      .addSelect('COUNT(usage.id)', 'usageCount')
      .groupBy('resource.id')
      .addGroupBy('resource.name')
      .orderBy('"usageCount"', 'DESC')
      .getRawMany();

    return raw.map((r) => ({ resourceId: r.resourceId, name: r.name, usageCount: Number(r.usageCount) }));
  }
}