import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceEntity } from '../infrastructure/entities/resource.entity.js';
import { MembershipLevel } from '../domain/membership-level.js';

@Injectable()
export class ResourcesService {
  constructor(@InjectRepository(ResourceEntity) private readonly resourceRepo: Repository<ResourceEntity>) {}

  create(name: string, category: string, minimumLevel: MembershipLevel) {
    return this.resourceRepo.save(this.resourceRepo.create({ name, category, minimumLevel, isActive: true }));
  }

  findAll() {
    return this.resourceRepo.find();
  }

  async findOne(id: string) {
    const resource = await this.resourceRepo.findOneBy({ id });
    if (!resource) throw new NotFoundException(`Resource ${id} not found`);
    return resource;
  }

  async decommission(id: string) {
    const resource = await this.findOne(id);
    resource.isActive = false;
    return this.resourceRepo.save(resource);
  }
}