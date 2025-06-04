import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Participant, ParticipantStatus } from '../entities/participant.entity';
import { CreateParticipantDto, UpdateParticipantDto } from '../dto';

/**
 * ParticipantsService
 * 
 * Handles all participant-related operations including:
 * - CRUD operations for participants
 * - Search and filtering by department
 * - Status management
 * - Event participation tracking
 */
@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  /**
   * Create a new participant
   */
  async create(createParticipantDto: CreateParticipantDto): Promise<Participant> {
    const participant = this.participantRepository.create({
      ...createParticipantDto,
      status: createParticipantDto.status ?? ParticipantStatus.PENDING,
    });

    return this.participantRepository.save(participant);
  }

  /**
   * Get all participants
   */
  async findAll(): Promise<Participant[]> {
    return this.participantRepository.find({
      relations: ['events'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Find a single participant by ID
   */
  async findOne(id: string): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { id },
      relations: ['events'],
    });

    if (!participant) {
      throw new NotFoundException(`Participant with ID ${id} not found`);
    }

    return participant;
  }

  /**
   * Update a participant
   */
  async update(id: string, updateParticipantDto: UpdateParticipantDto): Promise<Participant> {
    const participant = await this.findOne(id);
    
    Object.assign(participant, updateParticipantDto);
    
    return this.participantRepository.save(participant);
  }

  /**
   * Delete a participant
   */
  async remove(id: string): Promise<void> {
    const participant = await this.findOne(id);
    await this.participantRepository.remove(participant);
  }

  /**
   * Update participant status
   */
  async updateStatus(id: string, status: ParticipantStatus): Promise<Participant> {
    const participant = await this.findOne(id);
    participant.status = status;
    return this.participantRepository.save(participant);
  }

  /**
   * Search participants by name or email
   */
  async search(query: string): Promise<Participant[]> {
    return this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.events', 'events')
      .where('participant.name ILIKE :query OR participant.email ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('participant.name', 'ASC')
      .getMany();
  }

  /**
   * Get participants by department
   */
  async findByDepartment(department: string): Promise<Participant[]> {
    return this.participantRepository.find({
      where: { department },
      relations: ['events'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Get all departments
   */
  async getDepartments(): Promise<string[]> {
    const result = await this.participantRepository
      .createQueryBuilder('participant')
      .select('DISTINCT participant.department', 'department')
      .where('participant.department IS NOT NULL')
      .getRawMany();

    return result.map(row => row.department).filter(Boolean).sort();
  }

  /**
   * Get participants by status
   */
  async findByStatus(status: ParticipantStatus): Promise<Participant[]> {
    return this.participantRepository.find({
      where: { status },
      relations: ['events'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Get participants by multiple IDs
   */
  async findByIds(ids: string[]): Promise<Participant[]> {
    return this.participantRepository.find({
      where: { id: In(ids) },
      relations: ['events'],
    });
  }

  /**
   * Get participants by email addresses
   */
  async findByEmails(emails: string[]): Promise<Participant[]> {
    return this.participantRepository.find({
      where: { email: In(emails) },
      relations: ['events'],
    });
  }

  /**
   * Check if email is already taken
   */
  async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
    const query = this.participantRepository
      .createQueryBuilder('participant')
      .where('participant.email = :email', { email });

    if (excludeId) {
      query.andWhere('participant.id != :excludeId', { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  /**
   * Create default participants for demo purposes
   */
  async createDefaults(): Promise<Participant[]> {
    const defaultParticipants = [
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        role: 'Product Manager',
        department: 'Product',
        status: ParticipantStatus.ACCEPTED
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        role: 'Senior Developer',
        department: 'Engineering',
        status: ParticipantStatus.ACCEPTED
      },
      {
        name: 'Carol Williams',
        email: 'carol.williams@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
        role: 'Designer',
        department: 'Design',
        status: ParticipantStatus.PENDING
      },
      {
        name: 'David Brown',
        email: 'david.brown@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        role: 'Marketing Lead',
        department: 'Marketing',
        status: ParticipantStatus.MAYBE
      },
      {
        name: 'Eva Davis',
        email: 'eva.davis@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eva',
        role: 'QA Engineer',
        department: 'Engineering',
        status: ParticipantStatus.ACCEPTED
      },
      {
        name: 'Frank Miller',
        email: 'frank.miller@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank',
        role: 'Sales Manager',
        department: 'Sales',
        status: ParticipantStatus.DECLINED
      },
      {
        name: 'Grace Wilson',
        email: 'grace.wilson@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
        role: 'HR Specialist',
        department: 'Human Resources',
        status: ParticipantStatus.ACCEPTED
      },
      {
        name: 'Henry Garcia',
        email: 'henry.garcia@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry',
        role: 'DevOps Engineer',
        department: 'Engineering',
        status: ParticipantStatus.PENDING
      }
    ];

    const participants = defaultParticipants.map(participant => 
      this.participantRepository.create(participant)
    );
    
    return this.participantRepository.save(participants);
  }

  /**
   * Get participant statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<ParticipantStatus, number>;
    byDepartment: Record<string, number>;
  }> {
    const total = await this.participantRepository.count();
    
    const statusStats = await this.participantRepository
      .createQueryBuilder('participant')
      .select('participant.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('participant.status')
      .getRawMany();

    const departmentStats = await this.participantRepository
      .createQueryBuilder('participant')
      .select('participant.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .where('participant.department IS NOT NULL')
      .groupBy('participant.department')
      .getRawMany();

    const byStatus = Object.values(ParticipantStatus).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<ParticipantStatus, number>);

    statusStats.forEach(stat => {
      byStatus[stat.status] = parseInt(stat.count);
    });

    const byDepartment: Record<string, number> = {};
    departmentStats.forEach(stat => {
      byDepartment[stat.department] = parseInt(stat.count);
    });

    return {
      total,
      byStatus,
      byDepartment,
    };
  }
} 