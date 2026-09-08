import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrewLeadsService } from './crew-leads.service.js';

@Controller('crew-leads')
export class CrewLeadsController {
  constructor(private readonly crewLeadsService: CrewLeadsService) {}

  @Post()
  create(@Body('name') name: string) {
    return this.crewLeadsService.create(name);
  }

  @Get()
  findAll() {
    return this.crewLeadsService.findAll();
  }
}