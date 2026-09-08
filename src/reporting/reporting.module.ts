import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageRecordEntity } from '../infrastructure/entities/usage-record.entity.js';
import { ReportingService } from './reporting.service.js';
import { ReportingController } from './reporting.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([UsageRecordEntity])],
  providers: [ReportingService],
  controllers: [ReportingController],
})
export class ReportingModule {}