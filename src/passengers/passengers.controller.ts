import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PassengersService } from './passengers.service.js';
import { MembershipLevel } from '../domain/membership-level.js';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@Body('name') name: string, @Body('membershipLevel') membershipLevel: MembershipLevel) {
    return this.passengersService.create(name, membershipLevel);
  }

  @Get()
  findAll() {
    return this.passengersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengersService.findOne(id);
  }

  @Patch(':id/membership-level')
  updateLevel(@Param('id') id: string, @Body('membershipLevel') membershipLevel: MembershipLevel) {
    return this.passengersService.updateMembershipLevel(id, membershipLevel);
  }

  @Get(':id/accessible-resources')
  accessibleResources(@Param('id') id: string) {
    return this.passengersService.accessibleResources(id);
  }
}