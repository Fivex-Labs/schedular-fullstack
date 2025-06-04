import { ParticipantsService } from '../services/participants.service';
import { CreateParticipantDto, UpdateParticipantDto } from '../dto';
import { Participant, ParticipantStatus } from '../entities/participant.entity';
export declare class ParticipantsController {
    private readonly participantsService;
    constructor(participantsService: ParticipantsService);
    create(createParticipantDto: CreateParticipantDto): Promise<Participant>;
    createDefaults(): Promise<Participant[]>;
    findAll(): Promise<Participant[]>;
    search(query: string): Promise<Participant[]>;
    getDepartments(): Promise<string[]>;
    getStatistics(): Promise<{
        total: number;
        byStatus: Record<ParticipantStatus, number>;
        byDepartment: Record<string, number>;
    }>;
    findByDepartment(department: string): Promise<Participant[]>;
    findByStatus(status: ParticipantStatus): Promise<Participant[]>;
    findByIds(ids: string): Promise<Participant[]>;
    checkEmailAvailable(email: string, excludeId?: string): Promise<{
        available: boolean;
    }>;
    findOne(id: string): Promise<Participant>;
    update(id: string, updateParticipantDto: UpdateParticipantDto): Promise<Participant>;
    updateStatus(id: string, status: ParticipantStatus): Promise<Participant>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
