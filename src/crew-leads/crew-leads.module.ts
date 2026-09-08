import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewLeadEntity } from '../infrastructure/entities/crew-lead.entity.js';
import { CrewLeadsService } from './crew-leads.service.js';
import { CrewLeadsController } from './crew-leads.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CrewLeadEntity])],
  providers: [CrewLeadsService],
  controllers: [CrewLeadsController],
  exports: [CrewLeadsService],
})
export class CrewLeadsModule {}