import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerEntity } from '../infrastructure/entities/passenger.entity.js';
import { ResourceEntity } from '../infrastructure/entities/resource.entity.js';
import { PassengersService } from './passengers.service.js';
import { PassengersController } from './passengers.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerEntity, ResourceEntity])],
  providers: [PassengersService],
  controllers: [PassengersController],
  exports: [PassengersService],
})
export class PassengersModule {}