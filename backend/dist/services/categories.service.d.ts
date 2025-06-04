import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findVisible(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
    toggleVisibility(id: string): Promise<Category>;
    setVisibility(id: string, isVisible: boolean): Promise<Category>;
    findByColor(color: string): Promise<Category[]>;
    search(query: string): Promise<Category[]>;
    createDefaults(): Promise<Category[]>;
}
