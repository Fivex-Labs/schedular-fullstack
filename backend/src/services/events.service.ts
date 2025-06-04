import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import {
  Event,
  Category,
  Participant,
  RecurrenceRule,
  EventNotification,
  RecurrenceFrequency,
} from '../entities';
import {
  CreateEventDto,
  UpdateEventDto,
  CreateRecurrenceRuleDto,
  CreateEventNotificationDto,
} from '../dto';

/**
 * EventsService
 * 
 * Handles all event-related operations including:
 * - CRUD operations for events
 * - Recurring event generation
 * - Event search and filtering
 * - Participant management for events
 */
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @InjectRepository(RecurrenceRule)
    private readonly recurrenceRuleRepository: Repository<RecurrenceRule>,
    @InjectRepository(EventNotification)
    private readonly notificationRepository: Repository<EventNotification>,
  ) {}

  /**
   * Create a new event
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const {
      categoryId,
      participantIds,
      recurrence,
      notifications,
      ...eventData
    } = createEventDto;

    // Create the base event
    const event = this.eventRepository.create({
      ...eventData,
      startDate: new Date(eventData.startDate),
      endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
      isRecurring: !!recurrence,
    });

    // Handle category relationship
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      event.category = category;
      event.categoryId = categoryId;
    }

    // Handle recurrence rule
    if (recurrence) {
      const recurrenceRule = await this.createRecurrenceRule(recurrence);
      event.recurrence = recurrenceRule;
    }

    // Save the event first to get an ID
    const savedEvent = await this.eventRepository.save(event);

    // Handle participants
    if (participantIds && participantIds.length > 0) {
      const participants = await this.participantRepository.findBy({
        id: In(participantIds),
      });
      savedEvent.participants = participants;
    }

    // Handle notifications
    if (notifications && notifications.length > 0) {
      const eventNotifications = await this.createNotifications(
        notifications,
        savedEvent,
      );
      savedEvent.notifications = eventNotifications;
    }

    return this.eventRepository.save(savedEvent);
  }

  /**
   * Find all events with optional filtering
   */
  async findAll(params?: {
    startDate?: string;
    endDate?: string;
    categoryIds?: string[];
    includeRecurring?: boolean;
  }): Promise<Event[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.notifications', 'notifications')
      .leftJoinAndSelect('event.recurrence', 'recurrence');

    // Date range filtering
    if (params?.startDate && params?.endDate) {
      query.andWhere('event.startDate >= :startDate', {
        startDate: new Date(params.startDate),
      });
      query.andWhere('event.startDate <= :endDate', {
        endDate: new Date(params.endDate),
      });
    }

    // Category filtering
    if (params?.categoryIds && params.categoryIds.length > 0) {
      query.andWhere('event.categoryId IN (:...categoryIds)', {
        categoryIds: params.categoryIds,
      });
    }

    // Include/exclude recurring events
    if (params?.includeRecurring === false) {
      query.andWhere('event.isRecurring = false');
    }

    return query.getMany();
  }

  /**
   * Find a single event by ID
   */
  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['category', 'participants', 'notifications', 'recurrence'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  /**
   * Update an event
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    
    // Extract special properties that need custom handling
    const { categoryId, participantIds, recurrence, notifications, ...eventData } = updateEventDto as any;

    // Update basic event data
    if (Object.keys(eventData).length > 0) {
      Object.assign(event, {
        ...eventData,
        startDate: eventData.startDate ? new Date(eventData.startDate) : event.startDate,
        endDate: eventData.endDate ? new Date(eventData.endDate) : event.endDate,
        isRecurring: recurrence ? !!recurrence : event.isRecurring,
      });
    }

    // Handle category update
    if (categoryId !== undefined) {
      if (categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId },
        });
        if (!category) {
          throw new NotFoundException(`Category with ID ${categoryId} not found`);
        }
        event.category = category;
        event.categoryId = categoryId;
      } else {
        event.category = null;
        event.categoryId = null;
      }
    }

    // Handle recurrence rule update
    if (recurrence) {
      if (event.recurrence) {
        // Update existing recurrence rule
        Object.assign(event.recurrence, {
          ...recurrence,
          endDate: recurrence.endDate ? new Date(recurrence.endDate) : null,
        });
        await this.recurrenceRuleRepository.save(event.recurrence);
      } else {
        // Create new recurrence rule
        const recurrenceRule = await this.createRecurrenceRule(recurrence);
        event.recurrence = recurrenceRule;
      }
    }

    // Handle participants update
    if (participantIds !== undefined) {
      if (participantIds.length > 0) {
        const participants = await this.participantRepository.findBy({
          id: In(participantIds),
        });
        event.participants = participants;
      } else {
        event.participants = [];
      }
    }

    // Handle notifications update
    if (notifications !== undefined) {
      // Remove existing notifications
      if (event.notifications && event.notifications.length > 0) {
        await this.notificationRepository.remove(event.notifications);
      }
      
      // Create new notifications
      if (notifications.length > 0) {
        const eventNotifications = await this.createNotifications(notifications, event);
        event.notifications = eventNotifications;
      } else {
        event.notifications = [];
      }
    }

    return this.eventRepository.save(event);
  }

  /**
   * Delete an event
   */
  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  /**
   * Generate recurring event instances
   */
  async generateRecurringInstances(
    eventId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Event[]> {
    const baseEvent = await this.findOne(eventId);
    
    if (!baseEvent.isRecurring || !baseEvent.recurrence) {
      throw new BadRequestException('Event is not a recurring event');
    }

    const instances: Event[] = [];
    const rule = baseEvent.recurrence;
    let currentDate = new Date(Math.max(baseEvent.startDate.getTime(), startDate.getTime()));
    let instanceCount = 0;

    while (currentDate <= endDate) {
      // Check if this date is excluded
      const dateString = currentDate.toISOString().split('T')[0];
      if (baseEvent.excludedDates && baseEvent.excludedDates.includes(dateString)) {
        currentDate = this.getNextOccurrence(currentDate, rule);
        continue;
      }

      // Check count limit
      if (rule.count && instanceCount >= rule.count) {
        break;
      }

      // Check end date limit
      if (rule.endDate && currentDate > rule.endDate) {
        break;
      }

      // Create instance
      const instance = this.createEventInstance(baseEvent, currentDate);
      instances.push(instance);
      instanceCount++;

      // Get next occurrence
      currentDate = this.getNextOccurrence(currentDate, rule);
    }

    return instances;
  }

  /**
   * Add exclusion date to recurring event
   */
  async addExclusionDate(eventId: string, date: string): Promise<Event> {
    const event = await this.findOne(eventId);
    
    if (!event.isRecurring) {
      throw new BadRequestException('Event is not a recurring event');
    }

    if (!event.excludedDates) {
      event.excludedDates = [];
    }

    if (!event.excludedDates.includes(date)) {
      event.excludedDates.push(date);
    }

    return this.eventRepository.save(event);
  }

  /**
   * Get events by category
   */
  async findByCategory(categoryId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { categoryId },
      relations: ['category', 'participants', 'notifications', 'recurrence'],
    });
  }

  /**
   * Search events by title or description
   */
  async search(query: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.notifications', 'notifications')
      .leftJoinAndSelect('event.recurrence', 'recurrence')
      .where('event.title ILIKE :query OR event.description ILIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }

  /**
   * Private helper methods
   */
  private async createRecurrenceRule(
    recurrenceDto: CreateRecurrenceRuleDto,
  ): Promise<RecurrenceRule> {
    const recurrenceRule = this.recurrenceRuleRepository.create({
      ...recurrenceDto,
      endDate: recurrenceDto.endDate ? new Date(recurrenceDto.endDate) : undefined,
    });
    return this.recurrenceRuleRepository.save(recurrenceRule);
  }

  private async createNotifications(
    notificationsDto: CreateEventNotificationDto[],
    event: Event,
  ): Promise<EventNotification[]> {
    const notifications = notificationsDto.map((notificationDto) =>
      this.notificationRepository.create({
        ...notificationDto,
        event,
      }),
    );
    return this.notificationRepository.save(notifications);
  }

  private createEventInstance(baseEvent: Event, date: Date): Event {
    const duration = baseEvent.endDate
      ? baseEvent.endDate.getTime() - baseEvent.startDate.getTime()
      : 0;

    const instance = {
      ...baseEvent,
      id: `${baseEvent.id}-${date.toISOString().split('T')[0]}`,
      startDate: new Date(date),
      endDate: duration > 0 ? new Date(date.getTime() + duration) : undefined,
      parentEventId: baseEvent.id,
      isRecurring: false,
      recurrence: null as any,
      createdAt: undefined as any,
      updatedAt: undefined as any,
    };

    return instance as Event;
  }

  private getNextOccurrence(currentDate: Date, rule: RecurrenceRule): Date {
    const nextDate = new Date(currentDate);

    switch (rule.frequency) {
      case RecurrenceFrequency.DAILY:
        if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
          // Find next valid day of week
          do {
            nextDate.setDate(nextDate.getDate() + 1);
          } while (!rule.daysOfWeek.includes(nextDate.getDay()));
        } else {
          nextDate.setDate(nextDate.getDate() + rule.interval);
        }
        break;

      case RecurrenceFrequency.WEEKLY:
        if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
          const currentDay = nextDate.getDay();
          const nextDay = rule.daysOfWeek.find(day => day > currentDay);
          
          if (nextDay !== undefined) {
            nextDate.setDate(nextDate.getDate() + (nextDay - currentDay));
          } else {
            // Move to next week and first day of week
            const daysUntilNextWeek = 7 - currentDay + rule.daysOfWeek[0];
            nextDate.setDate(nextDate.getDate() + daysUntilNextWeek);
          }
        } else {
          nextDate.setDate(nextDate.getDate() + (7 * rule.interval));
        }
        break;

      case RecurrenceFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + rule.interval);
        if (rule.dayOfMonth) {
          nextDate.setDate(rule.dayOfMonth);
        }
        break;

      case RecurrenceFrequency.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + rule.interval);
        if (rule.monthOfYear !== undefined) {
          nextDate.setMonth(rule.monthOfYear);
        }
        if (rule.dayOfMonth) {
          nextDate.setDate(rule.dayOfMonth);
        }
        break;
    }

    return nextDate;
  }
} 