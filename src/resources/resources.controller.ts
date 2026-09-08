import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ResourcesService } from './resources.service.js';
import { MembershipLevel } from '../domain/membership-level.js';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(
    @Body('name') name: string,
    @Body('category') category: string,
    @Body('minimumLevel') minimumLevel: MembershipLevel,
  ) {
    return this.resourcesService.create(name, category, minimumLevel);
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Delete(':id')
  decommission(@Param('id') id: string) {
    return this.resourcesService.decommission(id);
  }
}