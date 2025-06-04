import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

/**
 * CategoriesService
 * 
 * Handles all category-related operations including:
 * - CRUD operations for categories
 * - Visibility management
 * - Color scheme management
 */
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Create a new category
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      isVisible: createCategoryDto.isVisible ?? true,
    });

    return this.categoryRepository.save(category);
  }

  /**
   * Get all categories
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['events'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Get only visible categories
   */
  async findVisible(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isVisible: true },
      relations: ['events'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Find a single category by ID
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['events'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Update a category
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    
    Object.assign(category, updateCategoryDto);
    
    return this.categoryRepository.save(category);
  }

  /**
   * Delete a category
   */
  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  /**
   * Toggle category visibility
   */
  async toggleVisibility(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isVisible = !category.isVisible;
    return this.categoryRepository.save(category);
  }

  /**
   * Set category visibility
   */
  async setVisibility(id: string, isVisible: boolean): Promise<Category> {
    const category = await this.findOne(id);
    category.isVisible = isVisible;
    return this.categoryRepository.save(category);
  }

  /**
   * Get categories by color
   */
  async findByColor(color: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { color },
      relations: ['events'],
    });
  }

  /**
   * Search categories by name
   */
  async search(query: string): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.events', 'events')
      .where('category.name ILIKE :query OR category.description ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('category.name', 'ASC')
      .getMany();
  }

  /**
   * Get default categories for new users
   */
  async createDefaults(): Promise<Category[]> {
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
} 