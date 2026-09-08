import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MembershipLevel } from '../../domain/membership-level.js';

@Entity('passengers')
export class PassengerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  membershipLevel: MembershipLevel;
}