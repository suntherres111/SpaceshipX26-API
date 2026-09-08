import { Controller, Param, Post } from '@nestjs/common';
import { AccessControlService } from './access-control.service.js';

@Controller('passengers/:passengerId/resources/:resourceId')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('use')
  useResource(@Param('passengerId') passengerId: string, @Param('resourceId') resourceId: string) {
    return this.accessControlService.useResource(passengerId, resourceId);
  }
}