import { Controller, Get, Param } from '@nestjs/common';
import { ReportingService } from './reporting.service.js';

@Controller()
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('passengers/:id/usage-history')
  personalHistory(@Param('id') id: string) {
    return this.reportingService.personalHistory(id);
  }

  @Get('reports/usage-by-level')
  usageByLevel() {
    return this.reportingService.usageByMembershipLevel();
  }

  @Get('reports/high-demand-resources')
  highDemand() {
    return this.reportingService.highDemandResources();
  }
}