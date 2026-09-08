import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usage_records')
export class UsageRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  passengerId: string;

  @Column('uuid')
  resourceId: string;

  @CreateDateColumn()
  usedAt: Date;
}