"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const participant_entity_1 = require("../entities/participant.entity");
let ParticipantsService = class ParticipantsService {
    participantRepository;
    constructor(participantRepository) {
        this.participantRepository = participantRepository;
    }
    async create(createParticipantDto) {
        const participant = this.participantRepository.create({
            ...createParticipantDto,
            status: createParticipantDto.status ?? participant_entity_1.ParticipantStatus.PENDING,
        });
        return this.participantRepository.save(participant);
    }
    async findAll() {
        return this.participantRepository.find({
            relations: ['events'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const participant = await this.participantRepository.findOne({
            where: { id },
            relations: ['events'],
        });
        if (!participant) {
            throw new common_1.NotFoundException(`Participant with ID ${id} not found`);
        }
        return participant;
    }
    async update(id, updateParticipantDto) {
        const participant = await this.findOne(id);
        Object.assign(participant, updateParticipantDto);
        return this.participantRepository.save(participant);
    }
    async remove(id) {
        const participant = await this.findOne(id);
        await this.participantRepository.remove(participant);
    }
    async updateStatus(id, status) {
        const participant = await this.findOne(id);
        participant.status = status;
        return this.participantRepository.save(participant);
    }
    async search(query) {
        return this.participantRepository
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.events', 'events')
            .where('participant.name ILIKE :query OR participant.email ILIKE :query', {
            query: `%${query}%`,
        })
            .orderBy('participant.name', 'ASC')
            .getMany();
    }
    async findByDepartment(department) {
        return this.participantRepository.find({
            where: { department },
            relations: ['events'],
            order: { name: 'ASC' },
        });
    }
    async getDepartments() {
        const result = await this.participantRepository
            .createQueryBuilder('participant')
            .select('DISTINCT participant.department', 'department')
            .where('participant.department IS NOT NULL')
            .getRawMany();
        return result.map(row => row.department).filter(Boolean).sort();
    }
    async findByStatus(status) {
        return this.participantRepository.find({
            where: { status },
            relations: ['events'],
            order: { name: 'ASC' },
        });
    }
    async findByIds(ids) {
        return this.participantRepository.find({
            where: { id: (0, typeorm_2.In)(ids) },
            relations: ['events'],
        });
    }
    async findByEmails(emails) {
        return this.participantRepository.find({
            where: { email: (0, typeorm_2.In)(emails) },
            relations: ['events'],
        });
    }
    async isEmailTaken(email, excludeId) {
        const query = this.participantRepository
            .createQueryBuilder('participant')
            .where('participant.email = :email', { email });
        if (excludeId) {
            query.andWhere('participant.id != :excludeId', { excludeId });
        }
        const count = await query.getCount();
        return count > 0;
    }
    async createDefaults() {
        const defaultParticipants = [
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
                role: 'Product Manager',
                department: 'Product',
                status: participant_entity_1.ParticipantStatus.ACCEPTED
            },
            {
                name: 'Bob Smith',
                email: 'bob.smith@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
                role: 'Senior Developer',
                department: 'Engineering',
                status: participant_entity_1.ParticipantStatus.ACCEPTED
            },
            {
                name: 'Carol Williams',
                email: 'carol.williams@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
                role: 'Designer',
                department: 'Design',
                status: participant_entity_1.ParticipantStatus.PENDING
            },
            {
                name: 'David Brown',
                email: 'david.brown@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
                role: 'Marketing Lead',
                department: 'Marketing',
                status: participant_entity_1.ParticipantStatus.MAYBE
            },
            {
                name: 'Eva Davis',
                email: 'eva.davis@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eva',
                role: 'QA Engineer',
                department: 'Engineering',
                status: participant_entity_1.ParticipantStatus.ACCEPTED
            },
            {
                name: 'Frank Miller',
                email: 'frank.miller@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank',
                role: 'Sales Manager',
                department: 'Sales',
                status: participant_entity_1.ParticipantStatus.DECLINED
            },
            {
                name: 'Grace Wilson',
                email: 'grace.wilson@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
                role: 'HR Specialist',
                department: 'Human Resources',
                status: participant_entity_1.ParticipantStatus.ACCEPTED
            },
            {
                name: 'Henry Garcia',
                email: 'henry.garcia@company.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry',
                role: 'DevOps Engineer',
                department: 'Engineering',
                status: participant_entity_1.ParticipantStatus.PENDING
            }
        ];
        const participants = defaultParticipants.map(participant => this.participantRepository.create(participant));
        return this.participantRepository.save(participants);
    }
    async getStatistics() {
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
        const byStatus = Object.values(participant_entity_1.ParticipantStatus).reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});
        statusStats.forEach(stat => {
            byStatus[stat.status] = parseInt(stat.count);
        });
        const byDepartment = {};
        departmentStats.forEach(stat => {
            byDepartment[stat.department] = parseInt(stat.count);
        });
        return {
            total,
            byStatus,
            byDepartment,
        };
    }
};
exports.ParticipantsService = ParticipantsService;
exports.ParticipantsService = ParticipantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(participant_entity_1.Participant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ParticipantsService);
//# sourceMappingURL=participants.service.js.map