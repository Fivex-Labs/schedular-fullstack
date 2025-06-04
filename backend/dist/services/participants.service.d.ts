import { Repository } from 'typeorm';
import { Participant, ParticipantStatus } from '../entities/participant.entity';
import { CreateParticipantDto, UpdateParticipantDto } from '../dto';
export declare class ParticipantsService {
    private readonly participantRepository;
    constructor(participantRepository: Repository<Participant>);
    create(createParticipantDto: CreateParticipantDto): Promise<Participant>;
    findAll(): Promise<Participant[]>;
    findOne(id: string): Promise<Participant>;
    update(id: string, updateParticipantDto: UpdateParticipantDto): Promise<Participant>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: ParticipantStatus): Promise<Participant>;
    search(query: string): Promise<Participant[]>;
    findByDepartment(department: string): Promise<Participant[]>;
    getDepartments(): Promise<string[]>;
    findByStatus(status: ParticipantStatus): Promise<Participant[]>;
    findByIds(ids: string[]): Promise<Participant[]>;
    findByEmails(emails: string[]): Promise<Participant[]>;
    isEmailTaken(email: string, excludeId?: string): Promise<boolean>;
    createDefaults(): Promise<Participant[]>;
    getStatistics(): Promise<{
        total: number;
        byStatus: Record<ParticipantStatus, number>;
        byDepartment: Record<string, number>;
    }>;
}
