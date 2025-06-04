import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventCategory } from '../models/calendar.models';

/**
 * CategoryService - Event Category Management Service
 * 
 * Educational Purpose:
 * This service demonstrates several important Angular and TypeScript concepts:
 * 1. Injectable service with 'root' provider (singleton pattern)
 * 2. RxJS BehaviorSubject for reactive state management
 * 3. Local storage integration for data persistence
 * 4. Observable pattern for component communication
 * 5. CRUD operations with error handling
 * 
 * Key Learning Points:
 * - How to manage application state using services
 * - Reactive programming with observables
 * - Data persistence strategies
 * - Service-to-component communication patterns
 */
@Injectable({
  providedIn: 'root' // Creates a singleton instance available app-wide
})
export class CategoryService {
  // Configuration constants for local storage keys
  private readonly CATEGORIES_KEY = 'schedular-categories';
  
  /**
   * BehaviorSubject vs Subject:
   * BehaviorSubject stores the current value and emits it immediately to new subscribers
   * This ensures components always have the latest data when they subscribe
   */
  private categoriesSubject = new BehaviorSubject<EventCategory[]>(this.getDefaultCategories());
  private visibleCategoriesSubject = new BehaviorSubject<Set<string>>(new Set());

  /**
   * Public observables for components to subscribe to
   * Using asObservable() prevents external code from calling next() directly
   * This enforces proper encapsulation and data flow
   */
  public categories$ = this.categoriesSubject.asObservable();
  public visibleCategories$ = this.visibleCategoriesSubject.asObservable();

  constructor() {
    // Initialize data on service creation
    this.loadCategories();
    this.initializeVisibleCategories();
  }

  /**
   * Provides default categories for new users or after data reset
   * 
   * Educational Note: This demonstrates:
   * - Default data patterns
   * - Object literal with consistent structure
   * - Color scheme design for UI consistency
   */
  private getDefaultCategories(): EventCategory[] {
    return [
      {
        id: 'personal',
        name: 'Personal',
        color: '#dcff00', // Bright yellow-green for personal events
        icon: '👤',
        isVisible: true,
        description: 'Personal events and appointments'
      },
      {
        id: 'work',
        name: 'Work',
        color: '#5cffe4', // Cyan for work-related events
        icon: '💼',
        isVisible: true,
        description: 'Work meetings and deadlines'
      },
      {
        id: 'family',
        name: 'Family',
        color: '#c58fff', // Purple for family events
        icon: '👨‍👩‍👧‍👦',
        isVisible: true,
        description: 'Family gatherings and events'
      },
      {
        id: 'health',
        name: 'Health',
        color: '#2dd55b', // Green for health-related events
        icon: '🏥',
        isVisible: true,
        description: 'Medical appointments and fitness'
      },
      {
        id: 'education',
        name: 'Education',
        color: '#ffc409', // Yellow for educational events
        icon: '🎓',
        isVisible: true,
        description: 'Classes, courses, and learning'
      },
      {
        id: 'social',
        name: 'Social',
        color: '#c5000f', // Red for social events
        icon: '🎉',
        isVisible: true,
        description: 'Social events and parties'
      }
    ];
  }

  /**
   * Loads categories from local storage with error handling
   * 
   * TODO: REPLACE_WITH_API - Load categories from backend
   * Current: Reading from localStorage
   * Future: GET /api/categories
   * 
   * Educational Notes:
   * - Try-catch for error handling with JSON parsing
   * - Fallback to defaults when data is corrupted
   * - Local storage as a simple persistence layer
   */
  private loadCategories(): void {
    // TODO: REPLACE_WITH_API - Replace localStorage with HTTP GET request
    const saved = localStorage.getItem(this.CATEGORIES_KEY);
    if (saved) {
      try {
        const categories = JSON.parse(saved) as EventCategory[];
        this.categoriesSubject.next(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to defaults if data is corrupted
        this.categoriesSubject.next(this.getDefaultCategories());
      }
    } else {
      // No saved data, use defaults
      this.saveCategories(this.getDefaultCategories());
    }
  }

  /**
   * Sets up initial visibility state based on category settings
   * 
   * Educational Note:
   * Demonstrates functional programming with:
   * - Array.filter() for conditional selection
   * - Array.map() for data transformation
   * - Set for efficient lookups
   */
  private initializeVisibleCategories(): void {
    const categories = this.categoriesSubject.value;
    const visibleIds = new Set(
      categories.filter(cat => cat.isVisible).map(cat => cat.id)
    );
    this.visibleCategoriesSubject.next(visibleIds);
  }

  /**
   * Saves categories to local storage and updates the observable
   * 
   * TODO: REPLACE_WITH_API - Save categories to backend
   * Current: Storing in localStorage
   * Future: POST/PUT /api/categories
   * 
   * Educational Note:
   * - JSON.stringify for object serialization
   * - Immediate state update after successful save
   */
  private saveCategories(categories: EventCategory[]): void {
    // TODO: REPLACE_WITH_API - Replace localStorage with HTTP POST/PUT
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    this.categoriesSubject.next(categories);
  }

  /**
   * Public getter for current categories
   * 
   * Educational Note:
   * Using .value on BehaviorSubject gives immediate access to current state
   * Useful when you need the data synchronously without subscribing
   */
  public getCategories(): EventCategory[] {
    return this.categoriesSubject.value;
  }

  /**
   * Finds a category by ID
   * 
   * Educational Note:
   * Array.find() returns first match or undefined
   * More efficient than filter()[0] for single item lookup
   */
  public getCategoryById(id: string): EventCategory | undefined {
    return this.categoriesSubject.value.find(cat => cat.id === id);
  }

  /**
   * Adds a new category to the collection
   * 
   * Educational Notes:
   * - Omit<Type, Keys> utility type removes specified properties
   * - Spread operator for object composition
   * - Immutable array updates with spread operator
   * 
   * @param category Category data without ID (generated automatically)
   * @returns The newly created category with generated ID
   */
  public addCategory(category: Omit<EventCategory, 'id'>): EventCategory {
    const newCategory: EventCategory = {
      ...category,
      id: this.generateId() // Generate unique ID for new category
    };
    
    // Create new array instead of mutating existing one (immutability)
    const categories = [...this.categoriesSubject.value, newCategory];
    this.saveCategories(categories);
    
    // Add to visible categories if it's set as visible
    if (newCategory.isVisible) {
      const currentVisible = new Set(this.visibleCategoriesSubject.value);
      currentVisible.add(newCategory.id);
      this.visibleCategoriesSubject.next(currentVisible);
    }
    
    return newCategory;
  }

  /**
   * Updates an existing category
   * 
   * Educational Notes:
   * - Partial<Type> utility type makes all properties optional
   * - Array.map() for immutable updates
   * - Conditional logic for related state updates
   * 
   * @param id Category ID to update
   * @param updates Partial category data to merge
   */
  public updateCategory(id: string, updates: Partial<EventCategory>): void {
    const categories = this.categoriesSubject.value.map(cat =>
      cat.id === id ? { ...cat, ...updates } : cat
    );
    this.saveCategories(categories);
    
    // Update visibility state if isVisible property changed
    if (updates.isVisible !== undefined) {
      const currentVisible = new Set(this.visibleCategoriesSubject.value);
      if (updates.isVisible) {
        currentVisible.add(id);
      } else {
        currentVisible.delete(id);
      }
      this.visibleCategoriesSubject.next(currentVisible);
    }
  }

  /**
   * Removes a category from the collection
   * 
   * TODO: REPLACE_WITH_API - Delete category from backend
   * Current: Removing from localStorage
   * Future: DELETE /api/categories/:id
   * 
   * Educational Notes:
   * - Array.filter() for removal without mutation
   * - Set.delete() for related state cleanup
   * 
   * @param id Category ID to delete
   */
  public deleteCategory(id: string): void {
    // Remove from categories array
    const categories = this.categoriesSubject.value.filter(cat => cat.id !== id);
    this.saveCategories(categories);
    
    // Remove from visible categories without trying to update the deleted category
    const currentVisible = new Set(this.visibleCategoriesSubject.value);
    currentVisible.delete(id);
    this.visibleCategoriesSubject.next(currentVisible);
  }

  /**
   * Toggles category visibility on/off
   * 
   * Educational Notes:
   * - Optional parameters with default behavior
   * - Set operations for efficient state management
   * - Conditional updates to prevent unnecessary operations
   * 
   * @param categoryId Category to toggle
   * @param isVisible Optional explicit visibility state
   */
  public toggleCategoryVisibility(categoryId: string, isVisible?: boolean): void {
    const currentVisible = new Set(this.visibleCategoriesSubject.value);
    
    if (isVisible !== undefined) {
      // Explicit visibility setting
      if (isVisible) {
        currentVisible.add(categoryId);
      } else {
        currentVisible.delete(categoryId);
      }
    } else {
      // Toggle current state
      if (currentVisible.has(categoryId)) {
        currentVisible.delete(categoryId);
      } else {
        currentVisible.add(categoryId);
      }
    }
    
    this.visibleCategoriesSubject.next(currentVisible);
    
    // Only update the category's isVisible property if the category still exists
    const categoryExists = this.getCategoryById(categoryId);
    if (categoryExists) {
      this.updateCategory(categoryId, { isVisible: currentVisible.has(categoryId) });
    }
  }

  /**
   * Checks if a category is currently visible
   * 
   * @param categoryId Category ID to check
   * @returns true if category is visible, false otherwise
   */
  public isCategoryVisible(categoryId: string): boolean {
    return this.visibleCategoriesSubject.value.has(categoryId);
  }

  /**
   * Gets only the currently visible categories
   * 
   * Educational Note:
   * Combines Set.has() for efficient lookup with Array.filter()
   * This pattern is useful for filtering based on a separate state collection
   * 
   * @returns Array of visible categories
   */
  public getVisibleCategories(): EventCategory[] {
    const visibleIds = this.visibleCategoriesSubject.value;
    return this.categoriesSubject.value.filter(cat => visibleIds.has(cat.id));
  }

  /**
   * Generates a unique ID for new categories
   * 
   * Educational Note:
   * Simple client-side ID generation using Math.random() and base36
   * In production with APIs, IDs would typically be generated server-side
   * 
   * TODO: REPLACE_WITH_API - Use server-generated IDs
   * Current: Client-side random ID generation
   * Future: Server-provided UUIDs or auto-increment IDs
   * 
   * @returns Unique string ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Resets all categories to default values
   * 
   * Educational Note:
   * Useful for testing, demos, or user preference resets
   * Shows how to reinitialize service state completely
   */
  public resetToDefaults(): void {
    this.saveCategories(this.getDefaultCategories());
    this.initializeVisibleCategories();
  }
}

/**
 * Usage Examples for Learning:
 * 
 * 1. In a component constructor:
 * constructor(private categoryService: CategoryService) {}
 * 
 * 2. Subscribe to categories:
 * this.categoryService.categories$.subscribe(categories => {
 *   this.categories = categories;
 * });
 * 
 * 3. Add a new category:
 * const newCategory = this.categoryService.addCategory({
 *   name: 'Travel',
 *   color: '#ff6b6b',
 *   icon: '✈️',
 *   isVisible: true,
 *   description: 'Travel and vacation events'
 * });
 * 
 * 4. Toggle category visibility:
 * this.categoryService.toggleCategoryVisibility('personal');
 */ 