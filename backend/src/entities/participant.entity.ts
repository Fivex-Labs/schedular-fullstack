import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Event } from './event.entity';

/**
 * Participant Status Enum
 * Maps to the status union type in frontend Participant interface
 */
export enum ParticipantStatus {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  PENDING = 'pending',
  MAYBE = 'maybe',
}

/**
 * Participant Entity
 * 
 * Maps to Participant interface in the frontend
 * Represents people who can be invited to events
 */
@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' }) // Profile picture URL
  avatar: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  role: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.PENDING,
  })
  status: ParticipantStatus;

  // Relationships
  @ManyToMany(() => Event, (event) => event.participants)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 