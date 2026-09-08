import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewLeadsModule } from './crew-leads/crew-leads.module.js';
import { PassengersModule } from './passengers/passengers.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { AccessControlModule } from './access-control/access-control.module.js';
import { ReportingModule } from './reporting/reporting.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
       TypeOrmModule.forRoot({
     type: 'postgres',
     url: process.env.DATABASE_URL,
     autoLoadEntities: true,
     synchronize: process.env.NODE_ENV !== 'production',
   }),
    CrewLeadsModule,
    PassengersModule,
    ResourcesModule,
    AccessControlModule,
    ReportingModule
  ],
})
export class AppModule {}