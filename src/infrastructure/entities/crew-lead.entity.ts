import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('crew_leads')
export class CrewLeadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}