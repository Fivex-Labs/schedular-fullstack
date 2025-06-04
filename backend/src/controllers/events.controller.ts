import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreateEventDto, UpdateEventDto } from '../dto';
import { Event } from '../entities/event.entity';

/**
 * EventsController
 * 
 * Handles all HTTP requests for event management including:
 * - CRUD operations for events
 * - Recurring event generation
 * - Event search and filtering
 * - Calendar-specific queries
 */
@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Create a new event
   * POST /api/events
   */
  @Post()
  async create(
    @Body(ValidationPipe) createEventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  /**
   * Get all events with optional filtering
   * GET /api/events?startDate=2024-01-01&endDate=2024-12-31&categoryIds=uuid1,uuid2
   */
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('includeRecurring') includeRecurring?: string,
  ): Promise<Event[]> {
    const params: any = {};
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (categoryIds) {
      params.categoryIds = categoryIds.split(',').filter(Boolean);
    }
    if (includeRecurring !== undefined) {
      params.includeRecurring = includeRecurring === 'true';
    }

    return this.eventsService.findAll(params);
  }

  /**
   * Search events by title or description
   * GET /api/events/search?q=meeting
   */
  @Get('search')
  async search(@Query('q') query: string): Promise<Event[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query cannot be empty');
    }
    return this.eventsService.search(query.trim());
  }

  /**
   * Get events by category
   * GET /api/events/category/:categoryId
   */
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<Event[]> {
    return this.eventsService.findByCategory(categoryId);
  }

  /**
   * Generate recurring event instances
   * GET /api/events/:id/instances?startDate=2024-01-01&endDate=2024-12-31
   */
  @Get(':id/instances')
  async getRecurringInstances(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Event[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    return this.eventsService.generateRecurringInstances(
      id,
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * Add exclusion date to recurring event
   * POST /api/events/:id/exclude
   */
  @Post(':id/exclude')
  async addExclusionDate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('date') date: string,
  ): Promise<Event> {
    if (!date) {
      throw new BadRequestException('Date is required');
    }
    return this.eventsService.addExclusionDate(id, date);
  }

  /**
   * Get a single event by ID
   * GET /api/events/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  /**
   * Update an event
   * PATCH /api/events/:id
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  /**
   * Delete an event
   * DELETE /api/events/:id
   */
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.eventsService.remove(id);
    return { message: 'Event deleted successfully' };
  }
} 