import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassengerEntity } from '../infrastructure/entities/passenger.entity.js';
import { ResourceEntity } from '../infrastructure/entities/resource.entity.js';
import { MembershipLevel } from '../domain/membership-level.js';
import { TierBasedAccessPolicy } from '../domain/access-policy.js';

@Injectable()
export class PassengersService {
  private readonly accessPolicy = new TierBasedAccessPolicy();

  constructor(
    @InjectRepository(PassengerEntity) private readonly passengerRepo: Repository<PassengerEntity>,
    @InjectRepository(ResourceEntity) private readonly resourceRepo: Repository<ResourceEntity>,
  ) {}

  create(name: string, membershipLevel: MembershipLevel) {
    return this.passengerRepo.save(this.passengerRepo.create({ name, membershipLevel }));
  }

  findAll() {
    return this.passengerRepo.find();
  }

  async findOne(id: string) {
    const passenger = await this.passengerRepo.findOneBy({ id });
    if (!passenger) throw new NotFoundException(`Passenger ${id} not found`);
    return passenger;
  }

  async updateMembershipLevel(id: string, membershipLevel: MembershipLevel) {
    const passenger = await this.findOne(id);
    passenger.membershipLevel = membershipLevel;
    return this.passengerRepo.save(passenger);
  }

  async accessibleResources(id: string) {
    const passenger = await this.findOne(id);
    const active = await this.resourceRepo.find({ where: { isActive: true } });
    return active.filter((r) => this.accessPolicy.canAccess(passenger, r));
  }
}