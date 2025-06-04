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
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Category } from '../entities/category.entity';

/**
 * CategoriesController
 * 
 * Handles all HTTP requests for category management including:
 * - CRUD operations for categories
 * - Visibility management
 * - Color scheme management
 * - Default category creation
 */
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Create a new category
   * POST /api/categories
   */
  @Post()
  async create(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Create default categories
   * POST /api/categories/defaults
   */
  @Post('defaults')
  async createDefaults(): Promise<Category[]> {
    return this.categoriesService.createDefaults();
  }

  /**
   * Get all categories or only visible ones
   * GET /api/categories?visible=true
   */
  @Get()
  async findAll(@Query('visible') visible?: string): Promise<Category[]> {
    if (visible === 'true') {
      return this.categoriesService.findVisible();
    }
    return this.categoriesService.findAll();
  }

  /**
   * Search categories by name or description
   * GET /api/categories/search?q=work
   */
  @Get('search')
  async search(@Query('q') query: string): Promise<Category[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query cannot be empty');
    }
    return this.categoriesService.search(query.trim());
  }

  /**
   * Get categories by color
   * GET /api/categories/color/:color
   */
  @Get('color/:color')
  async findByColor(@Param('color') color: string): Promise<Category[]> {
    return this.categoriesService.findByColor(color);
  }

  /**
   * Get a single category by ID
   * GET /api/categories/:id
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  /**
   * Update a category
   * PATCH /api/categories/:id
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * Toggle category visibility
   * PATCH /api/categories/:id/toggle-visibility
   */
  @Patch(':id/toggle-visibility')
  async toggleVisibility(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoriesService.toggleVisibility(id);
  }

  /**
   * Set category visibility
   * PATCH /api/categories/:id/visibility
   */
  @Patch(':id/visibility')
  async setVisibility(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isVisible') isVisible: boolean,
  ): Promise<Category> {
    if (typeof isVisible !== 'boolean') {
      throw new BadRequestException('isVisible must be a boolean');
    }
    return this.categoriesService.setVisibility(id, isVisible);
  }

  /**
   * Delete a category
   * DELETE /api/categories/:id
   */
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.categoriesService.remove(id);
    return { message: 'Category deleted successfully' };
  }
} 