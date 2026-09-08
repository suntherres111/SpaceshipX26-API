import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from '../infrastructure/entities/resource.entity.js';
import { ResourcesService } from './resources.service.js';
import { ResourcesController } from './resources.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  providers: [ResourcesService],
  controllers: [ResourcesController],
  exports: [ResourcesService],
})
export class ResourcesModule {}