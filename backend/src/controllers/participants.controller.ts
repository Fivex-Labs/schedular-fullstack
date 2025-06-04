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
import { ParticipantsService } from '../services/participants.service';
import { CreateParticipantDto, UpdateParticipantDto } from '../dto';
import { Participant, ParticipantStatus } from '../entities/participant.entity';

/**
 * ParticipantsController
 * 
 * Handles all HTTP requests for participant management including:
 * - CRUD operations for participants
 * - Search and filtering functionality
 * - Department management
 * - Status tracking
 */
@Controller('api/participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  /**
   * Create a new participant
   * POST /api/participants
   */
  @Post()
  async create(
    @Body(ValidationPipe) createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    // Check if email is already taken
    const emailTaken = await this.participantsService.isEmailTaken(
      createParticipantDto.email,
    );
    if (emailTaken) {
      throw new BadRequestException('Email address is already in use');
    }

    return this.participantsService.create(createParticipantDto);
  }

  /**
   * Create default participants for demo
   * POST /api/participants/defaults
   */
  @Post('defaults')
  async createDefaults(): Promise<Participant[]> {
    return this.participantsService.createDefaults();
  }

  /**
   * Get all participants
   * GET /api/participants
   */
  @Get()
  async findAll(): Promise<Participant[]> {
    return this.participantsService.findAll();
  }

  /**
   * Search participants by name or email
   * GET /api/participants/search?q=alice
   */
  @Get('search')
  async search(@Query('q') query: string): Promise<Participant[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query cannot be empty');
    }
    return this.participantsService.search(query.trim());
  }

  /**
   * Get all departments
   * GET /api/participants/departments
   */
  @Get('departments')
  async getDepartments(): Promise<string[]> {
    return this.participantsService.getDepartments();
  }

  /**
   * Get participant statistics
   * GET /api/participants/statistics
   */
  @Get('statistics')
  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<ParticipantStatus, number>;
    byDepartment: Record<string, number>;
  }> {
    return this.participantsService.getStatistics();
  }

  /**
   * Get participants by department
   * GET /api/participants/department/:department
   */
  @Get('department/:department')
  async findByDepartment(
    @Param('department') department: string,
  ): Promise<Participant[]> {
    return this.participantsService.findByDepartment(department);
  }

  /**
   * Get participants by status
   * GET /api/participants/status/:status
   */
  @Get('status/:status')
  async findByStatus(
    @Param('status') status: ParticipantStatus,
  ): Promise<Participant[]> {
    if (!Object.values(ParticipantStatus).includes(status)) {
      throw new BadRequestException('Invalid participant status');
    }
    return this.participantsService.findByStatus(status);
  }

  /**
   * Get participants by multiple IDs
   * GET /api/participants/bulk?ids=uuid1,uuid2,uuid3
   */
  @Get('bulk')
  async findByIds(@Query('ids') ids: string): Promise<Participant[]> {
    if (!ids) {
      throw new BadRequestException('IDs parameter is required');
    }
    const idArray = ids.split(',').filter(Boolean);
    if (idArray.length === 0) {
      throw new BadRequestException('At least one ID is required');
    }
    return this.participantsService.findByIds(idArray);
  }

  /**
   * Check if email is available
   * GET /api/participants/email-available?email=test@example.com&excludeId=uuid
   */
  @Get('email-available')
  async checkEmailAvailable(
    @Query('email') email: string,
    @Query('excludeId') excludeId?: string,
  ): Promise<{ available: boolean }> {
    if (!email) {
      throw new BadRequestException('Email parameter is required');
    }
    const taken = await this.participantsService.isEmailTaken(email, excludeId);
    return { available: !taken };
  }

  /**
   * Get a single participant by ID
   * GET /api/participants/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Participant> {
    return this.participantsService.findOne(id);
  }

  /**
   * Update a participant
   * PATCH /api/participants/:id
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateParticipantDto: UpdateParticipantDto,
  ): Promise<Participant> {
    // Check if email is already taken by another participant
    if (updateParticipantDto.email) {
      const emailTaken = await this.participantsService.isEmailTaken(
        updateParticipantDto.email,
        id,
      );
      if (emailTaken) {
        throw new BadRequestException('Email address is already in use');
      }
    }

    return this.participantsService.update(id, updateParticipantDto);
  }

  /**
   * Update participant status
   * PATCH /api/participants/:id/status
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ParticipantStatus,
  ): Promise<Participant> {
    if (!Object.values(ParticipantStatus).includes(status)) {
      throw new BadRequestException('Invalid participant status');
    }
    return this.participantsService.updateStatus(id, status);
  }

  /**
   * Delete a participant
   * DELETE /api/participants/:id
   */
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.participantsService.remove(id);
    return { message: 'Participant deleted successfully' };
  }
} 