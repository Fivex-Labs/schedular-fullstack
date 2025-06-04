import { ParticipantStatus } from '../entities/participant.entity';
export declare class CreateParticipantDto {
    name: string;
    email: string;
    avatar: string;
    role?: string;
    department?: string;
    status?: ParticipantStatus;
}
