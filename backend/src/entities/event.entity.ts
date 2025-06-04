import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Participant } from './participant.entity';
import { EventNotification } from './event-notification.entity';
import { RecurrenceRule } from './recurrence-rule.entity';

/**
 * Event Entity
 * 
 * Maps to CalendarEvent interface in the frontend
 * The core event entity with all event information
 */
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  allDay: boolean;

  @Column({ type: 'varchar', length: 7 }) // Hex color code
  color: string;

  @Column({ type: 'varchar', length: 7, default: '#ffffff' }) // Text color for contrast
  textColor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'uuid', nullable: true }) // For recurring instances, reference to parent
  parentEventId: string;

  @Column({ type: 'simple-array', nullable: true }) // Dates to skip in recurrence (YYYY-MM-DD)
  excludedDates: string[];

  // Relationships
  @ManyToOne(() => Category, (category) => category.events, { nullable: true })
  category: Category | null;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @ManyToMany(() => Participant, (participant) => participant.events)
  @JoinTable({
    name: 'event_participants',
    joinColumn: { name: 'eventId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'participantId', referencedColumnName: 'id' },
  })
  participants: Participant[];

  @OneToMany(() => EventNotification, (notification) => notification.event, {
    cascade: true,
    eager: true,
  })
  notifications: EventNotification[];

  @ManyToOne(() => RecurrenceRule, { nullable: true, cascade: true, eager: true })
  recurrence: RecurrenceRule;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 