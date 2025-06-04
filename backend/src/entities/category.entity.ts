import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Event } from './event.entity';

/**
 * Category Entity
 * 
 * Maps to EventCategory interface in the frontend
 * Represents event categories for organizing and filtering events
 */
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 7 }) // Hex color code
  color: string;

  @Column({ type: 'varchar', length: 10 }) // Emoji or icon identifier
  icon: string;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @OneToMany(() => Event, (event) => event.category)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 