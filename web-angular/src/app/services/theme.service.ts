import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Theme type definition
 * 
 * Educational Note:
 * Using union types for type safety and autocompletion
 * This prevents invalid theme values and enables TypeScript checking
 */
export type Theme = 'light' | 'dark';

/**
 * ThemeService - Application Theme Management Service
 * 
 * Educational Purpose:
 * This service demonstrates several important web development concepts:
 * 1. CSS custom properties (CSS variables) manipulation
 * 2. Browser localStorage for user preference persistence
 * 3. System preference detection using media queries
 * 4. DOM manipulation through classList API
 * 5. Observable pattern for reactive theme updates
 * 6. Progressive enhancement with fallbacks
 * 
 * Key Learning Points:
 * - Working with browser APIs (localStorage, matchMedia)
 * - CSS custom properties for dynamic theming
 * - User preference management and persistence
 * - System integration (respecting OS theme preferences)
 * - Service-based state management patterns
 */
@Injectable({
  providedIn: 'root' // Singleton service for consistent theme state
})
export class ThemeService {
  // Constant for localStorage key to avoid typos and enable easy changes
  private readonly THEME_KEY = 'schedular-theme';
  
  /**
   * BehaviorSubject for theme state management
   * 
   * Educational Note:
   * BehaviorSubject is perfect for theme management because:
   * - It holds the current value (theme state)
   * - New subscribers immediately get the current theme
   * - All components can react to theme changes in real-time
   */
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  
  /**
   * Public observable for components to subscribe to theme changes
   * 
   * Educational Note:
   * Using asObservable() prevents external code from calling next()
   * This maintains proper encapsulation - only the service can change the theme
   */
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    // Apply the initial theme to the DOM immediately
    this.applyTheme(this.themeSubject.value);
  }

  /**
   * Determines the initial theme based on user preferences and system settings
   * 
   * Educational Notes:
   * Priority order for theme selection:
   * 1. Saved user preference (localStorage)
   * 2. System/OS preference (media query)
   * 3. Default fallback (light theme)
   * 
   * This demonstrates progressive enhancement and user experience best practices
   * 
   * @returns The initial theme to use
   */
  private getInitialTheme(): Theme {
    // TODO: REPLACE_WITH_API - Load user theme preference from backend
    // Current: Using localStorage for persistence
    // Future: GET /api/user/preferences/theme
    
    // Check localStorage first - user's explicit choice takes priority
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    /**
     * Check system preference using CSS media query
     * 
     * Educational Note:
     * window.matchMedia() provides access to CSS media query results in JavaScript
     * '(prefers-color-scheme: dark)' detects if user has dark mode enabled system-wide
     * This respects user's OS-level preference when no explicit choice is made
     */
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default fallback to light theme
    return 'light';
  }

  /**
   * Toggles between light and dark themes
   * 
   * Educational Note:
   * Simple toggle implementation using ternary operator
   * This is a common pattern for binary state toggles
   */
  public toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Sets a specific theme
   * 
   * TODO: REPLACE_WITH_API - Save theme preference to backend
   * Current: Saving to localStorage only
   * Future: PUT /api/user/preferences/theme
   * 
   * Educational Notes:
   * - Updates the observable state first
   * - Persists the choice to localStorage
   * - Applies the theme to the DOM
   * This order ensures consistency across all subscribers
   * 
   * @param theme The theme to apply ('light' or 'dark')
   */
  public setTheme(theme: Theme): void {
    // Update observable state - this notifies all subscribers
    this.themeSubject.next(theme);
    
    // Persist user choice to localStorage
    // TODO: REPLACE_WITH_API - Save to user preferences API
    localStorage.setItem(this.THEME_KEY, theme);
    
    // Apply theme to DOM immediately
    this.applyTheme(theme);
  }

  /**
   * Gets the current theme synchronously
   * 
   * Educational Note:
   * Sometimes you need the current theme value immediately without subscribing
   * BehaviorSubject.value provides synchronous access to current state
   * 
   * @returns Current theme value
   */
  public getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Applies the theme to the DOM by manipulating CSS classes
   * 
   * Educational Notes:
   * - Uses document.documentElement to target the <html> element
   * - CSS classes trigger different CSS custom property values
   * - classList.add/remove is more efficient than className manipulation
   * - This enables CSS-based theme switching without JavaScript style manipulation
   * 
   * CSS Structure:
   * - .light-theme sets CSS variables for light colors
   * - .dark-theme sets CSS variables for dark colors
   * - Components use var(--color-*) to automatically adapt
   * 
   * @param theme Theme to apply to the DOM
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }

  /**
   * Future method for syncing with system theme changes
   * 
   * Educational Note:
   * This method could listen to system theme changes and update accordingly
   * Useful for respecting user's system-wide theme changes while app is running
   */
  // public listenToSystemThemeChanges(): void {
  //   if (window.matchMedia) {
  //     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //     mediaQuery.addEventListener('change', (e) => {
  //       // Only auto-switch if user hasn't made an explicit choice
  //       const hasUserPreference = localStorage.getItem(this.THEME_KEY);
  //       if (!hasUserPreference) {
  //         this.setTheme(e.matches ? 'dark' : 'light');
  //       }
  //     });
  //   }
  // }
}

/**
 * Usage Examples for Learning:
 * 
 * 1. Inject service in component:
 * constructor(private themeService: ThemeService) {}
 * 
 * 2. Subscribe to theme changes:
 * this.themeService.theme$.subscribe(theme => {
 *   this.isDarkTheme = theme === 'dark';
 * });
 * 
 * 3. Toggle theme (for theme switcher button):
 * onToggleTheme() {
 *   this.themeService.toggleTheme();
 * }
 * 
 * 4. Get current theme synchronously:
 * const currentTheme = this.themeService.getCurrentTheme();
 * 
 * 5. Set specific theme:
 * this.themeService.setTheme('dark');
 * 
 * CSS Integration Example:
 * :root {
 *   --color-primary: #000000;
 *   --color-background: #ffffff;
 * }
 * 
 * .dark-theme {
 *   --color-primary: #ffffff;
 *   --color-background: #000000;
 * }
 * 
 * .my-component {
 *   color: var(--color-primary);
 *   background: var(--color-background);
 * }
 */ 