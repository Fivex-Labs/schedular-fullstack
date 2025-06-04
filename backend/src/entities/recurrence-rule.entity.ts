import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Recurrence Frequency Enum
 * Maps to the frequency union type in frontend RecurrenceRule interface
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

/**
 * RecurrenceRule Entity
 * 
 * Maps to RecurrenceRule interface in the frontend
 * Defines how events repeat over time
 */
@Entity('recurrence_rules')
export class RecurrenceRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RecurrenceFrequency,
  })
  frequency: RecurrenceFrequency;

  @Column({ type: 'int', default: 1 }) // Every X days/weeks/months/years
  interval: number;

  @Column({ type: 'simple-array', nullable: true }) // For weekly: 0=Sunday, 1=Monday, etc.
  daysOfWeek: number[];

  @Column({ type: 'int', nullable: true }) // For monthly: specific day of month
  dayOfMonth: number;

  @Column({ type: 'int', nullable: true }) // For yearly: specific month (0-11)
  monthOfYear: number;

  @Column({ type: 'timestamp', nullable: true }) // When recurrence stops
  endDate: Date;

  @Column({ type: 'int', nullable: true }) // Number of occurrences (alternative to endDate)
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 