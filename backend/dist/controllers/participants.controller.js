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
exports.ParticipantsController = void 0;
const common_1 = require("@nestjs/common");
const participants_service_1 = require("../services/participants.service");
const dto_1 = require("../dto");
const participant_entity_1 = require("../entities/participant.entity");
let ParticipantsController = class ParticipantsController {
    participantsService;
    constructor(participantsService) {
        this.participantsService = participantsService;
    }
    async create(createParticipantDto) {
        const emailTaken = await this.participantsService.isEmailTaken(createParticipantDto.email);
        if (emailTaken) {
            throw new common_1.BadRequestException('Email address is already in use');
        }
        return this.participantsService.create(createParticipantDto);
    }
    async createDefaults() {
        return this.participantsService.createDefaults();
    }
    async findAll() {
        return this.participantsService.findAll();
    }
    async search(query) {
        if (!query || query.trim().length === 0) {
            throw new common_1.BadRequestException('Search query cannot be empty');
        }
        return this.participantsService.search(query.trim());
    }
    async getDepartments() {
        return this.participantsService.getDepartments();
    }
    async getStatistics() {
        return this.participantsService.getStatistics();
    }
    async findByDepartment(department) {
        return this.participantsService.findByDepartment(department);
    }
    async findByStatus(status) {
        if (!Object.values(participant_entity_1.ParticipantStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid participant status');
        }
        return this.participantsService.findByStatus(status);
    }
    async findByIds(ids) {
        if (!ids) {
            throw new common_1.BadRequestException('IDs parameter is required');
        }
        const idArray = ids.split(',').filter(Boolean);
        if (idArray.length === 0) {
            throw new common_1.BadRequestException('At least one ID is required');
        }
        return this.participantsService.findByIds(idArray);
    }
    async checkEmailAvailable(email, excludeId) {
        if (!email) {
            throw new common_1.BadRequestException('Email parameter is required');
        }
        const taken = await this.participantsService.isEmailTaken(email, excludeId);
        return { available: !taken };
    }
    async findOne(id) {
        return this.participantsService.findOne(id);
    }
    async update(id, updateParticipantDto) {
        if (updateParticipantDto.email) {
            const emailTaken = await this.participantsService.isEmailTaken(updateParticipantDto.email, id);
            if (emailTaken) {
                throw new common_1.BadRequestException('Email address is already in use');
            }
        }
        return this.participantsService.update(id, updateParticipantDto);
    }
    async updateStatus(id, status) {
        if (!Object.values(participant_entity_1.ParticipantStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid participant status');
        }
        return this.participantsService.updateStatus(id, status);
    }
    async remove(id) {
        await this.participantsService.remove(id);
        return { message: 'Participant deleted successfully' };
    }
};
exports.ParticipantsController = ParticipantsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateParticipantDto]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('defaults'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "createDefaults", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('departments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('department/:department'),
    __param(0, (0, common_1.Param)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "findByDepartment", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('bulk'),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "findByIds", null);
__decorate([
    (0, common_1.Get)('email-available'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('excludeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "checkEmailAvailable", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateParticipantDto]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParticipantsController.prototype, "remove", null);
exports.ParticipantsController = ParticipantsController = __decorate([
    (0, common_1.Controller)('api/participants'),
    __metadata("design:paramtypes", [participants_service_1.ParticipantsService])
], ParticipantsController);
//# sourceMappingURL=participants.controller.js.map