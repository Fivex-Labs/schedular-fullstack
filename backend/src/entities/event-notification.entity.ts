import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Event } from './event.entity';

/**
 * Notification Type Enum
 * Maps to the notification type union in frontend EventNotification interface
 */
export enum NotificationType {
  POPUP = 'popup',
  EMAIL = 'email',
  PUSH = 'push',
}

/**
 * EventNotification Entity
 * 
 * Maps to EventNotification interface in the frontend
 * Represents notification settings for events
 */
@Entity('event_notifications')
export class EventNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.POPUP,
  })
  type: NotificationType;

  @Column({ type: 'int' }) // Minutes before event to trigger
  timing: number;

  @Column({ type: 'text' }) // Custom notification text
  message: string;

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  // Relationships
  @ManyToOne(() => Event, (event) => event.notifications, { onDelete: 'CASCADE' })
  event: Event;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 