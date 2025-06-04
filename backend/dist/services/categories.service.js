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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
let CategoriesService = class CategoriesService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(createCategoryDto) {
        const category = this.categoryRepository.create({
            ...createCategoryDto,
            isVisible: createCategoryDto.isVisible ?? true,
        });
        return this.categoryRepository.save(category);
    }
    async findAll() {
        return this.categoryRepository.find({
            relations: ['events'],
            order: { name: 'ASC' },
        });
    }
    async findVisible() {
        return this.categoryRepository.find({
            where: { isVisible: true },
            relations: ['events'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['events'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }
    async toggleVisibility(id) {
        const category = await this.findOne(id);
        category.isVisible = !category.isVisible;
        return this.categoryRepository.save(category);
    }
    async setVisibility(id, isVisible) {
        const category = await this.findOne(id);
        category.isVisible = isVisible;
        return this.categoryRepository.save(category);
    }
    async findByColor(color) {
        return this.categoryRepository.find({
            where: { color },
            relations: ['events'],
        });
    }
    async search(query) {
        return this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.events', 'events')
            .where('category.name ILIKE :query OR category.description ILIKE :query', {
            query: `%${query}%`,
        })
            .orderBy('category.name', 'ASC')
            .getMany();
    }
    async createDefaults() {
        const defaultCategories = [
            {
                name: 'Personal',
                color: '#dcff00',
                icon: '👤',
                isVisible: true,
                description: 'Personal events and appointments'
            },
            {
                name: 'Work',
                color: '#5cffe4',
                icon: '💼',
                isVisible: true,
                description: 'Work meetings and deadlines'
            },
            {
                name: 'Family',
                color: '#c58fff',
                icon: '👨‍👩‍👧‍👦',
                isVisible: true,
                description: 'Family gatherings and events'
            },
            {
                name: 'Health',
                color: '#2dd55b',
                icon: '🏥',
                isVisible: true,
                description: 'Medical appointments and fitness'
            },
            {
                name: 'Education',
                color: '#ffc409',
                icon: '🎓',
                isVisible: true,
                description: 'Classes, courses, and learning'
            },
            {
                name: 'Social',
                color: '#c5000f',
                icon: '🎉',
                isVisible: true,
                description: 'Social events and parties'
            }
        ];
        const categories = defaultCategories.map(cat => this.categoryRepository.create(cat));
        return this.categoryRepository.save(categories);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map