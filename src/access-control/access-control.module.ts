import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerEntity } from '../infrastructure/entities/passenger.entity.js';
import { ResourceEntity } from '../infrastructure/entities/resource.entity.js';
import { UsageRecordEntity } from '../infrastructure/entities/usage-record.entity.js';
import { AccessControlService } from './access-control.service.js';
import { AccessControlController } from './access-control.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerEntity, ResourceEntity, UsageRecordEntity])],
  providers: [AccessControlService],
  controllers: [AccessControlController],
  exports: [AccessControlService],
})
export class AccessControlModule {}