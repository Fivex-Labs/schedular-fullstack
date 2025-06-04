import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Category } from '../entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    createDefaults(): Promise<Category[]>;
    findAll(visible?: string): Promise<Category[]>;
    search(query: string): Promise<Category[]>;
    findByColor(color: string): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    toggleVisibility(id: string): Promise<Category>;
    setVisibility(id: string, isVisible: boolean): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
