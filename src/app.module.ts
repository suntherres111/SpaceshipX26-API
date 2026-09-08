import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewLeadsModule } from './crew-leads/crew-leads.module.js';

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
    // feature modules (Passengers, Resources, AccessControl, CrewLeads, Audit, Reporting) get added here as we build them
  ],
})
export class AppModule {}