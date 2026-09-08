import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassengerEntity } from '../infrastructure/entities/passenger.entity.js';
import { ResourceEntity } from '../infrastructure/entities/resource.entity.js';
import { UsageRecordEntity } from '../infrastructure/entities/usage-record.entity.js';
import { TierBasedAccessPolicy } from '../domain/access-policy.js';

@Injectable()
export class AccessControlService {
  private readonly accessPolicy = new TierBasedAccessPolicy();

  constructor(
    @InjectRepository(PassengerEntity) private readonly passengerRepo: Repository<PassengerEntity>,
    @InjectRepository(ResourceEntity) private readonly resourceRepo: Repository<ResourceEntity>,
    @InjectRepository(UsageRecordEntity) private readonly usageRepo: Repository<UsageRecordEntity>,
  ) {}

  async useResource(passengerId: string, resourceId: string): Promise<UsageRecordEntity> {
    const passenger = await this.passengerRepo.findOneBy({ id: passengerId });
    if (!passenger) throw new NotFoundException(`Passenger ${passengerId} not found`);

    const resource = await this.resourceRepo.findOneBy({ id: resourceId });
    if (!resource) throw new NotFoundException(`Resource ${resourceId} not found`);

    // Re-checked live against the passenger's CURRENT tier — not cached from discovery time.
    if (!this.accessPolicy.canAccess(passenger, resource)) {
      throw new ForbiddenException(
        `Passenger does not have sufficient membership level to access "${resource.name}".`,
      );
    }

    const record = this.usageRepo.create({ passengerId, resourceId });
    return this.usageRepo.save(record);
  }

  // Backing method for Level 3's personal-history endpoint — not exposed via controller yet.
  history(passengerId: string): Promise<UsageRecordEntity[]> {
    return this.usageRepo.find({ where: { passengerId }, order: { usedAt: 'DESC' } });
  }
}