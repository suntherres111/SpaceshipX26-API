import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { MembershipLevel } from '../../domain/membership-level.js';

@Entity('resources')
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: 'int' })
  minimumLevel: MembershipLevel;

  @Column({ default: true })
  isActive: boolean;
}