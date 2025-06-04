import { Component, ElementRef, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ThemeService, Theme } from '../../services/theme.service';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { RecurrenceService } from '../../services/recurrence.service';
import { ParticipantsService } from '../../services/participants.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarEvent, EventCategory, RecurrenceRule, EventNotification, NewEvent, MiniCalendarDate, Participant } from '../../models/calendar.models';

/**
 * CalendarComponent - Main Calendar Container Component
 * 
 * Educational Purpose:
 * This is the main container component that demonstrates several important Angular concepts:
 * 
 * 1. **Component Architecture Patterns**:
 *    - Container/Presenter pattern (this is the container)
 *    - Service injection and dependency management
 *    - ViewChild for DOM element access
 *    - Lifecycle hooks (OnInit, OnDestroy)
 * 
 * 2. **State Management**:
 *    - Complex component state with multiple data types
 *    - Observable subscriptions with proper cleanup
 *    - Form state management
 *    - Modal state coordination
 * 
 * 3. **Third-Party Integration**:
 *    - FullCalendar library integration
 *    - Event handling and data synchronization
 *    - Plugin configuration and management
 * 
 * 4. **Advanced Angular Features**:
 *    - Reactive forms and validation
 *    - Change detection strategies
 *    - Event emission and handling
 *    - Template-driven forms
 * 
 * 5. **Real-World Patterns**:
 *    - Error handling and user feedback
 *    - Loading states and async operations
 *    - Data transformation and filtering
 *    - Complex user interactions
 * 
 * Key Learning Areas:
 * - Component lifecycle management
 * - Service integration patterns
 * - Complex state coordination
 * - Event handling and user interaction
 * - Data flow and transformation
 * - Third-party library integration
 */
@Component({
  selector: 'app-calendar',
  standalone: true, // Modern Angular standalone component (no NgModule required)
  imports: [CommonModule, FormsModule], // Direct imports for standalone components
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  /**
   * ViewChild for FullCalendar DOM element access
   * 
   * Educational Note:
   * ViewChild with static: true ensures the element is available in ngOnInit
   * The exclamation mark (!) tells TypeScript this will be assigned before use
   * ElementRef provides direct access to the native DOM element
   */
  @ViewChild('calendarEl', { static: true }) calendarEl!: ElementRef;
  
  /**
   * FullCalendar instance - the main calendar object
   * 
   * Educational Note:
   * This demonstrates integration with third-party libraries
   * The Calendar class comes from the @fullcalendar/core package
   */
  private calendar!: Calendar;
  
  /**
   * RxJS Subject for managing component lifecycle and subscription cleanup
   * 
   * Educational Note:
   * This is a common pattern for preventing memory leaks in Angular
   * All subscriptions use .pipe(takeUntil(this.destroy$)) for automatic cleanup
   * The Subject emits when the component is destroyed
   */
  private destroy$ = new Subject<void>();
  
  // =================================================================
  // CALENDAR STATE MANAGEMENT
  // =================================================================
  
  /**
   * Current calendar view type
   * 
   * Educational Note:
   * FullCalendar supports multiple view types: dayGridMonth, timeGridWeek, timeGridDay
   * This state tracks which view is currently active for UI synchronization
   */
  currentView = 'dayGridMonth';
  
  /**
   * Display strings for current calendar periods
   * 
   * Educational Note:
   * These are computed from Date objects and used in templates
   * Demonstrates separation of data (Date) from presentation (string)
   */
  currentMonthYear = '';
  miniCalendarMonthYear = '';
  
  // =================================================================
  // MODAL STATE MANAGEMENT
  // =================================================================
  
  /**
   * Modal visibility flags
   * 
   * Educational Note:
   * Boolean flags for controlling modal visibility in templates
   * This pattern allows multiple modals with coordinated state
   * Only one modal should be open at a time for good UX
   */
  showCreateModal = false;
  showCategoryModal = false;
  showNotificationPermissionBanner = false;
  private notificationBannerTimeout: any;
  showDeleteConfirmModal = false;
  showEventDetailsModal = false;
  showRecurringEditChoiceModal = false;
  showRecurringDeleteChoiceModal = false;
  
  /**
   * Theme state tracking
   * 
   * Educational Note:
   * Local component state that mirrors the theme service state
   * Used for conditional styling and theme-aware UI elements
   */
  isDarkTheme = false;
  
  // =================================================================
  // DATE SYNCHRONIZATION MANAGEMENT
  // =================================================================
  
  /**
   * Date tracking for main calendar and mini calendar synchronization
   * 
   * Educational Note:
   * Multiple Date objects track different calendar states:
   * - currentMainDate: What the main calendar is showing
   * - currentMiniDate: What the mini calendar is showing  
   * - selectedDate: User's selected date (can be null)
   * 
   * This allows independent navigation while maintaining sync when needed
   */
  private currentMainDate = new Date();
  private currentMiniDate = new Date();
  private selectedDate: Date | null = null;
  
  /**
   * Mini calendar data structures
   * 
   * Educational Note:
   * weekDays: Short day labels for calendar headers
   * miniCalendarDates: Array of date objects with metadata for rendering
   */
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  miniCalendarDates: MiniCalendarDate[] = [];
  
  // =================================================================
  // EVENT AND CATEGORY DATA MANAGEMENT
  // =================================================================
  
  /**
   * Event and category collections
   * 
   * Educational Note:
   * - categories: All available event categories
   * - visibleCategories: Set of visible category IDs (for efficient lookup)
   * - events: All events in the application
   * - filteredEvents: Events after category filtering (what actually displays)
   * 
   * This separation allows for efficient filtering and category management
   */
  categories: EventCategory[] = [];
  visibleCategories = new Set<string>();
  events: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  
  // =================================================================
  // FORM DATA OBJECTS
  // =================================================================
  
  /**
   * Form data for creating/editing events
   * 
   * TODO: REPLACE_WITH_API - Event creation and updates
   * Current: Local form state management
   * Future: Integrate with backend APIs for persistence
   * 
   * Educational Note:
   * NewEvent interface defines the shape of form data
   * Default values provide a good user experience
   * Form data is separate from actual CalendarEvent objects
   */
  newEvent: NewEvent = {
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    allDay: false,
    color: '#dcff00',
    categoryId: '',
    location: '',
    recurrence: undefined,
    notifications: [],
    participants: []
  };

  /**
   * Form data for creating new categories
   * 
   * Educational Note:
   * Simple object literal for category creation form
   * Default values match the application's design system
   */
  newCategory = {
    name: '',
    color: '#dcff00',
    icon: '📅',
    description: ''
  };

  // =================================================================
  // RECURRENCE MANAGEMENT
  // =================================================================
  
  /**
   * Recurrence configuration state
   * 
   * Educational Note:
   * - showRecurrenceOptions: UI toggle for recurrence section
   * - recurrencePresets: Pre-configured recurrence patterns from service
   * - showCustomDaySelector: Shows day-of-week selection for custom patterns
   * - selectedDaysOfWeek: Set of selected days (0=Sunday, 1=Monday, etc.)
   * - weekDayLabels: Display data for day selection UI
   */
  showRecurrenceOptions = false;
  recurrencePresets: { label: string; rule: RecurrenceRule }[] = [];
  
  showCustomDaySelector = false;
  selectedDaysOfWeek: Set<number> = new Set();
  weekDayLabels = [
    { day: 1, label: 'Mon', fullName: 'Monday' },
    { day: 2, label: 'Tue', fullName: 'Tuesday' },
    { day: 3, label: 'Wed', fullName: 'Wednesday' },
    { day: 4, label: 'Thu', fullName: 'Thursday' },
    { day: 5, label: 'Fri', fullName: 'Friday' },
    { day: 6, label: 'Sat', fullName: 'Saturday' },
    { day: 0, label: 'Sun', fullName: 'Sunday' }
  ];
  
  // =================================================================
  // NOTIFICATION MANAGEMENT
  // =================================================================
  
  /**
   * Notification system state
   * 
   * Educational Note:
   * - notificationPresets: Common notification timing options
   * - notificationPermission: Browser permission state for notifications
   * This integrates with the browser's native notification API
   */
  notificationPresets: { timing: number; label: string }[] = [];
  notificationPermission: NotificationPermission = 'default';

  // =================================================================
  // DELETE CONFIRMATION STATE
  // =================================================================
  
  /**
   * Category deletion confirmation
   * 
   * Educational Note:
   * Temporarily stores the category to delete for confirmation dialog
   * This pattern prevents accidental deletions and improves UX
   */
  categoryToDelete: EventCategory | null = null;

  // =================================================================
  // EVENT DETAILS AND EDITING STATE
  // =================================================================
  
  /**
   * Event selection and editing state
   * 
   * Educational Note:
   * Complex state management for event interactions:
   * - selectedEvent: The event being viewed/edited
   * - selectedEventIsRecurring: Whether it's a recurring event instance
   * - selectedEventInstance: FullCalendar event object for recurring instances
   * - selectedEventDate: Specific date for recurring event instances
   * - isEditingEvent: Whether in edit mode (vs. create mode)
   * - editType: Whether editing single occurrence or entire series
   */
  selectedEvent: CalendarEvent | null = null;
  selectedEventIsRecurring = false;
  selectedEventInstance: any = null; // FullCalendar event object
  selectedEventDate: Date | null = null;
  isEditingEvent = false;
  editType: 'occurrence' | 'series' = 'series';

  // =================================================================
  // UI SECTION EXPANSION STATE
  // =================================================================
  
  /**
   * Collapsible form sections state
   * 
   * Educational Note:
   * Boolean flags for expanding/collapsing form sections
   * Improves UX by allowing users to focus on relevant parts
   * Reduces visual complexity for simpler event creation
   */
  showCategorySection = false;
  showRecurrenceSection = false;
  showNotificationsSection = false;
  showParticipantsSection = false;

  // =================================================================
  // PARTICIPANTS MANAGEMENT
  // =================================================================
  
  /**
   * Participant selection and search state
   * 
   * Educational Note:
   * - participants: All available participants from service
   * - availableParticipants: Filtered list for selection
   * - participantSearchQuery: Current search term
   * - filteredParticipants: Search results
   * 
   * This demonstrates real-time search and filtering patterns
   */
  participants: Participant[] = [];
  availableParticipants: Participant[] = [];
  participantSearchQuery = '';
  filteredParticipants: Participant[] = [];

  /**
   * Constructor with dependency injection
   * 
   * Educational Note:
   * Angular's dependency injection system automatically provides service instances
   * Services are injected as private properties for use throughout the component
   * ChangeDetectorRef allows manual control over change detection when needed
   */
  constructor(
    private themeService: ThemeService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private recurrenceService: RecurrenceService,
    private participantsService: ParticipantsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Component initialization lifecycle hook
   * 
   * Educational Note:
   * ngOnInit is called after Angular initializes the component
   * This is where you set up subscriptions, initialize data, and configure the component
   * Order of operations matters - services must be initialized before calendar setup
   */
  ngOnInit() {
    // Initialize service connections and data
    this.initializeServices();
    
    // Set up the FullCalendar instance
    this.initializeCalendar();
    
    // Update display strings
    this.updateDisplays();
    
    // Set up reactive subscriptions
    this.subscribeToTheme();
    this.subscribeToCategories();
    this.subscribeToNotifications();
    this.subscribeToParticipants();
    
    // Load initial event data
    this.loadEvents();
    
    /**
     * Calendar health check interval
     * 
     * Educational Note:
     * FullCalendar can sometimes disappear due to DOM changes or CSS issues
     * This periodic check detects when the calendar view is missing and re-renders it
     * This is a defensive programming technique for third-party library integration
     */
    setInterval(() => {
      if (this.calendar && this.calendar.el && !this.calendar.el.querySelector('.fc-view')) {
        console.log('⚕️ Calendar health check: re-rendering missing calendar');
        this.calendar.render();
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Component cleanup lifecycle hook
   * 
   * Educational Note:
   * ngOnDestroy is called when the component is being removed from the DOM
   * This is critical for preventing memory leaks by cleaning up:
   * - RxJS subscriptions
   * - Event listeners
   * - Third-party library instances
   * - Timers and intervals
   */
  ngOnDestroy() {
    // Signal all subscriptions to complete
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up notification banner timeout
    if (this.notificationBannerTimeout) {
      clearTimeout(this.notificationBannerTimeout);
      this.notificationBannerTimeout = null;
    }
    
    // Clean up FullCalendar instance
    if (this.calendar) {
      this.calendar.destroy();
    }
  }

  /**
   * Initialize service connections and data
   * 
   * Educational Note:
   * This method sets up the initial data from services and configures event listeners
   * It demonstrates how to coordinate multiple services in a component
   */
  private initializeServices() {
    // Load configuration data from services
    this.recurrencePresets = this.recurrenceService.getRecurrencePresets();
    this.notificationPresets = this.notificationService.getNotificationPresets();
    this.newEvent.notifications = this.notificationService.createDefaultNotifications();
    
    /**
     * Global event listener for notification clicks
     * 
     * Educational Note:
     * This demonstrates browser API integration and custom event handling
     * When a browser notification is clicked, it triggers this handler
     * The event includes the eventId for navigation or action
     */
    window.addEventListener('notification-click', (event: any) => {
      this.handleNotificationClick(event.detail.eventId);
    });
  }

  /**
   * Subscribe to theme service changes
   * 
   * Educational Note:
   * This demonstrates the reactive programming pattern with RxJS
   * - pipe(takeUntil(this.destroy$)) ensures subscription cleanup
   * - The subscription updates local state and triggers calendar re-render
   * - setTimeout(0) ensures DOM updates complete before re-rendering
   */
  private subscribeToTheme() {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$)) // Automatic cleanup on component destroy
      .subscribe((theme: Theme) => { // Type annotation for educational clarity
        this.isDarkTheme = theme === 'dark';
        // Trigger calendar re-render to apply new theme styles
        if (this.calendar) {
          setTimeout(() => {
            this.calendar.render();
            console.log('🎨 Calendar re-rendered after theme change');
          }, 0);
        }
      });
  }

  /**
   * Subscribe to category service changes
   * 
   * Educational Note:
   * This shows how to handle multiple observables from the same service
   * Two separate subscriptions handle different aspects of category management
   */
  private subscribeToCategories() {
    // Subscribe to category list changes
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: EventCategory[]) => {
        this.categories = categories;
        // Auto-select first category for new events if none selected
        if (categories.length > 0 && !this.newEvent.categoryId) {
          this.newEvent.categoryId = categories[0].id;
        }
      });

    // Subscribe to category visibility changes
    this.categoryService.visibleCategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((visibleIds: Set<string>) => {
        this.visibleCategories = visibleIds;
        // Re-filter events when visibility changes
        this.filterEvents();
      });
  }

  private subscribeToNotifications() {
    this.notificationService.notificationStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.notificationPermission = status.permission;
        const shouldShow = status.supported && status.permission === 'default';
        
        if (shouldShow && !this.showNotificationPermissionBanner) {
          // Banner is being shown for the first time
          this.showNotificationPermissionBanner = true;
          
          // Auto-dismiss after 8 seconds
          this.notificationBannerTimeout = setTimeout(() => {
            this.showNotificationPermissionBanner = false;
          }, 8000);
        } else if (!shouldShow) {
          // Clear timeout if banner should be hidden
          if (this.notificationBannerTimeout) {
            clearTimeout(this.notificationBannerTimeout);
            this.notificationBannerTimeout = null;
          }
          this.showNotificationPermissionBanner = false;
        }
      });
  }

  private subscribeToParticipants() {
    this.participantsService.participants$
      .pipe(takeUntil(this.destroy$))
      .subscribe(participants => {
        this.participants = participants;
        this.availableParticipants = participants;
        this.updateFilteredParticipants();
      });
  }

  private initializeCalendar() {
    this.calendar = new Calendar(this.calendarEl.nativeElement, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: false, // We'll create our own header
      height: '100%',
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      events: [],
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      eventResize: this.handleEventResize.bind(this),
      datesSet: this.handleDatesSet.bind(this),
      dateClick: this.handleDateClick.bind(this)
    });

    this.calendar.render();
  }

  private loadEvents() {
    // Ensure we have categories before creating events
    if (this.categories.length === 0) {
      // If categories aren't loaded yet, try again after a short delay
      setTimeout(() => this.loadEvents(), 100);
      return;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    
    // Get the number of days in current month to ensure valid dates
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get category IDs for assignment
    const personalCategory = this.categories.find(cat => cat.name === 'Personal');
    const workCategory = this.categories.find(cat => cat.name === 'Work');
    const socialCategory = this.categories.find(cat => cat.name === 'Social');
    
    // Calculate safe dates for current month (ensuring they don't exceed month boundaries)
    const welcomeDay = Math.min(5, daysInMonth);
    const meetingDay = Math.min(8, daysInMonth);
    const standupDay = Math.min(10, daysInMonth);
    const clientCallDay = Math.min(12, daysInMonth);
    const coffeeDay = Math.min(14, daysInMonth);
    const gymDay = Math.min(16, daysInMonth);
    const reviewDay = Math.min(18, daysInMonth);
    const deadlineDay = Math.min(20, daysInMonth);
    const dinnerDay = Math.min(22, daysInMonth);
    const doctorDay = Math.min(25, daysInMonth);
    const familyDay = Math.min(28, daysInMonth);
    
    // Create a variety of sample events for the current month
    const sampleEvents: CalendarEvent[] = [
      {
        id: 'sample-1',
        title: 'Welcome to Enhanced Schedular!',
        description: 'Explore categories, participants, recurring events, and notifications. Click this event to see all the details!',
        startDate: new Date(currentYear, currentMonth, welcomeDay, 10, 0),
        endDate: new Date(currentYear, currentMonth, welcomeDay, 11, 0),
        allDay: false,
        color: personalCategory?.color || '#dcff00',
        textColor: '#000000',
        categoryId: personalCategory?.id || '',
        notifications: this.notificationService.createDefaultNotifications(),
        participants: this.participantsService.getRandomParticipants(2),
        location: 'Your Calendar App',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-2',
        title: 'Team Standup Meeting',
        description: 'Daily team sync and progress updates',
        startDate: new Date(currentYear, currentMonth, meetingDay, 9, 0),
        endDate: new Date(currentYear, currentMonth, meetingDay, 9, 30),
        allDay: false,
        color: workCategory?.color || '#ff6b6b',
        textColor: '#ffffff',
        categoryId: workCategory?.id || '',
        notifications: [{
          id: 'notif-2',
          type: 'popup',
          timing: 15,
          message: 'Standup meeting starting soon',
          isEnabled: true
        }],
        participants: this.participantsService.getParticipantsByDepartment('Engineering').slice(0, 4),
        location: 'Conference Room A',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-3',
        title: 'Sprint Planning',
        description: 'Plan next sprint and assign tasks',
        startDate: new Date(currentYear, currentMonth, standupDay, 14, 0),
        endDate: new Date(currentYear, currentMonth, standupDay, 16, 0),
        allDay: false,
        color: workCategory?.color || '#ff6b6b',
        textColor: '#ffffff',
        categoryId: workCategory?.id || '',
        notifications: [{
          id: 'notif-3',
          type: 'popup',
          timing: 30,
          message: 'Sprint planning meeting in 30 minutes',
          isEnabled: true
        }],
        participants: this.participantsService.getParticipantsByDepartment('Engineering').concat(
          this.participantsService.getParticipantsByDepartment('Product').slice(0, 2)
        ),
        location: 'Main Conference Room',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-4',
        title: 'Client Call - Q4 Review',
        description: 'Quarterly business review with key client',
        startDate: new Date(currentYear, currentMonth, clientCallDay, 11, 0),
        endDate: new Date(currentYear, currentMonth, clientCallDay, 12, 0),
        allDay: false,
        color: workCategory?.color || '#ff6b6b',
        textColor: '#ffffff',
        categoryId: workCategory?.id || '',
        notifications: [
          {
            id: 'notif-4a',
            type: 'popup',
            timing: 60,
            message: 'Client call in 1 hour - prepare materials',
            isEnabled: true
          },
          {
            id: 'notif-4b',
            type: 'popup',
            timing: 15,
            message: 'Client call starting soon',
            isEnabled: true
          }
        ],
        participants: this.participantsService.getParticipantsByDepartment('Sales').concat(
          this.participantsService.getParticipantsByDepartment('Product').slice(0, 1)
        ),
        location: 'Zoom Meeting',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-5',
        title: 'Coffee with Alex',
        description: 'Catch up over coffee and discuss new project ideas',
        startDate: new Date(currentYear, currentMonth, coffeeDay, 15, 30),
        endDate: new Date(currentYear, currentMonth, coffeeDay, 16, 30),
        allDay: false,
        color: socialCategory?.color || '#4ecdc4',
        textColor: '#ffffff',
        categoryId: socialCategory?.id || '',
        notifications: [{
          id: 'notif-5',
          type: 'popup',
          timing: 30,
          message: 'Coffee meetup in 30 minutes',
          isEnabled: true
        }],
        participants: [this.participantsService.getParticipantById('p1')!].filter(Boolean),
        location: 'Central Perk Café',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-6',
        title: 'Gym Workout',
        description: 'Evening workout session - chest and shoulders',
        startDate: new Date(currentYear, currentMonth, gymDay, 18, 0),
        endDate: new Date(currentYear, currentMonth, gymDay, 19, 30),
        allDay: false,
        color: personalCategory?.color || '#dcff00',
        textColor: '#000000',
        categoryId: personalCategory?.id || '',
        notifications: [{
          id: 'notif-6',
          type: 'popup',
          timing: 15,
          message: 'Time to hit the gym!',
          isEnabled: true
        }],
        participants: [], // Solo workout
        location: 'FitLife Gym',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-7',
        title: 'Code Review Session',
        description: 'Review pull requests and discuss best practices',
        startDate: new Date(currentYear, currentMonth, reviewDay, 10, 0),
        endDate: new Date(currentYear, currentMonth, reviewDay, 11, 30),
        allDay: false,
        color: workCategory?.color || '#ff6b6b',
        textColor: '#ffffff',
        categoryId: workCategory?.id || '',
        notifications: [{
          id: 'notif-7',
          type: 'popup',
          timing: 10,
          message: 'Code review session starting soon',
          isEnabled: true
        }],
        participants: this.participantsService.getParticipantsByDepartment('Engineering').slice(0, 3),
        location: 'Development Room',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-8',
        title: 'Project Deadline',
        description: 'Final submission and deliverables due',
        startDate: new Date(currentYear, currentMonth, deadlineDay),
        allDay: true,
        color: '#8B1538', // Changed to a readable dark red for better visibility
        textColor: '#ffffff',
        categoryId: workCategory?.id || '',
        notifications: [
          {
            id: 'notif-8a',
            type: 'popup',
            timing: 1440, // 24 hours before
            message: 'Project deadline tomorrow!',
            isEnabled: true
          },
          {
            id: 'notif-8b',
            type: 'popup',
            timing: 120, // 2 hours before
            message: 'Project deadline today - final push!',
            isEnabled: true
          }
        ],
        participants: this.participantsService.getParticipantsByDepartment('Marketing').slice(0, 2).concat(
          this.participantsService.getParticipantsByDepartment('Product').slice(0, 1)
        ),
        location: 'Office',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-9',
        title: 'Team Dinner',
        description: 'Monthly team dinner at the new Italian restaurant',
        startDate: new Date(currentYear, currentMonth, dinnerDay, 19, 0),
        endDate: new Date(currentYear, currentMonth, dinnerDay, 21, 0),
        allDay: false,
        color: socialCategory?.color || '#4ecdc4',
        textColor: '#ffffff',
        categoryId: socialCategory?.id || '',
        notifications: [{
          id: 'notif-9',
          type: 'popup',
          timing: 60,
          message: 'Team dinner in 1 hour - see you there!',
          isEnabled: true
        }],
        participants: this.participantsService.getRandomParticipants(5),
        location: 'Bella Vista Italian Restaurant',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-10',
        title: 'Doctor Appointment',
        description: 'Annual health checkup',
        startDate: new Date(currentYear, currentMonth, doctorDay, 13, 0),
        endDate: new Date(currentYear, currentMonth, doctorDay, 14, 0),
        allDay: false,
        color: personalCategory?.color || '#dcff00',
        textColor: '#000000',
        categoryId: personalCategory?.id || '',
        notifications: [
          {
            id: 'notif-10a',
            type: 'popup',
            timing: 1440, // 24 hours before
            message: 'Doctor appointment tomorrow - remember to bring insurance card',
            isEnabled: true
          },
          {
            id: 'notif-10b',
            type: 'popup',
            timing: 30,
            message: 'Doctor appointment in 30 minutes',
            isEnabled: true
          }
        ],
        participants: [], // Personal appointment
        location: 'City Medical Center',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sample-11',
        title: 'Family Movie Night',
        description: 'Weekly family movie night with popcorn and snacks',
        startDate: new Date(currentYear, currentMonth, familyDay, 20, 0),
        endDate: new Date(currentYear, currentMonth, familyDay, 22, 30),
        allDay: false,
        color: socialCategory?.color || '#4ecdc4',
        textColor: '#ffffff',
        categoryId: socialCategory?.id || '',
        notifications: [{
          id: 'notif-11',
          type: 'popup',
          timing: 30,
          message: 'Family movie night starts in 30 minutes!',
          isEnabled: true
        }],
        participants: this.participantsService.getRandomParticipants(3),
        location: 'Home - Living Room',
        isRecurring: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Only add future events or today's events (skip past events)
    const validEvents = sampleEvents.filter(event => {
      const eventDate = event.allDay ? event.startDate : event.startDate;
      const eventDay = eventDate.getDate();
      return eventDay >= currentDay; // Only include today and future events
    });

    // Add events only if they don't already exist (to prevent duplicates on reload)
    const existingIds = new Set(this.events.map(e => e.id));
    const newEvents = validEvents.filter(event => !existingIds.has(event.id));
    
    if (newEvents.length > 0) {
      this.events.push(...newEvents);
      console.log(`📅 Created ${newEvents.length} sample events for ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
    }
    
    this.filterEvents();
    this.updateCalendarEvents();
  }

  private filterEvents() {
    console.log('🔍 FILTER EVENTS CALLED');
    console.log('Total events to filter:', this.events.length);
    console.log('Visible categories:', Array.from(this.visibleCategories));
    
    // Filter events based on visible categories
    this.filteredEvents = this.events.filter(event => {
      const shouldShow = !event.categoryId || this.visibleCategories.has(event.categoryId);
      console.log(`Event "${event.title}" (category: ${event.categoryId}) - Should show: ${shouldShow}`);
      return shouldShow;
    });
    
    console.log('Events after filtering:', this.filteredEvents.length);
    
    // Update mini calendar to reflect filtered events
    this.generateMiniCalendar();
    
    // Update calendar with filtered events - don't call updateCalendarEvents here since it's called separately
    // this.updateCalendarEvents();
  }

  private updateCalendarEvents() {
    console.log('📅 UPDATE CALENDAR EVENTS CALLED');
    this.calendar.removeAllEvents();
    
    console.log('Processing', this.filteredEvents.length, 'filtered events');
    
    // Generate recurring event instances
    const now = new Date();
    const future = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year ahead
    
    let totalEventsAdded = 0;
    
    this.filteredEvents.forEach(event => {
      console.log(`Processing event: "${event.title}" (recurring: ${event.isRecurring})`);
      
      if (event.isRecurring && event.recurrence) {
        console.log('Generating recurring instances for:', event.title);
        const instances = this.recurrenceService.generateRecurringEvents(event, now, future);
        console.log(`Generated ${instances.length} instances for recurring event`);
        
        instances.forEach(instance => {
          console.log(`Adding recurring instance: "${instance.title}" on ${instance.startDate.toISOString()}`);
          this.calendar.addEvent({
            id: instance.id,
            title: instance.title,
            start: instance.startDate,
            end: instance.endDate,
            allDay: instance.allDay,
            color: instance.color,
            textColor: instance.textColor,
            extendedProps: {
              ...instance,
              isRecurringInstance: true
            }
          });
          totalEventsAdded++;
        });
      } else {
        console.log(`Adding single event: "${event.title}" on ${event.startDate.toISOString()}`);
        this.calendar.addEvent({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          allDay: event.allDay,
          color: event.color,
          textColor: event.textColor,
          extendedProps: event
        });
        totalEventsAdded++;
      }
    });
    
    console.log(`✅ Total events added to calendar: ${totalEventsAdded}`);
    
    // Update mini calendar indicators to match main calendar
    this.generateMiniCalendar();
    
    // Force calendar re-render to prevent disappearing issues
    setTimeout(() => {
      if (this.calendar) {
        this.calendar.render();
        console.log('📅 Calendar re-rendered after event updates');
      }
    }, 0);
  }

  private handleDatesSet(info: any) {
    // Use the calendar's actual current date instead of view start
    this.currentMainDate = this.calendar.getDate();
    
    // Only update mini calendar if it's not being navigated independently
    if (!this.isSameMonth(this.currentMiniDate, this.currentMainDate)) {
      this.currentMiniDate = new Date(this.currentMainDate);
    }
    
    this.updateDisplays();
  }

  private handleDateClick(info: any) {
    this.selectedDate = new Date(info.date);
    this.generateMiniCalendar();
  }

  private isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth();
  }

  private updateDisplays() {
    this.updateCurrentMonthYear();
    this.updateMiniCalendarMonthYear();
    this.generateMiniCalendar();
  }

  private updateCurrentMonthYear() {
    this.currentMonthYear = this.currentMainDate.toLocaleDateString(undefined, { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  private updateMiniCalendarMonthYear() {
    this.miniCalendarMonthYear = this.currentMiniDate.toLocaleDateString(undefined, { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  private generateMiniCalendar() {
    const year = this.currentMiniDate.getFullYear();
    const month = this.currentMiniDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates: MiniCalendarDate[] = [];
    const today = new Date();
    
    // Get date range for mini calendar (6 weeks)
    const miniCalendarStart = new Date(startDate);
    const miniCalendarEnd = new Date(startDate);
    miniCalendarEnd.setDate(miniCalendarEnd.getDate() + 42);
    
    // Generate all event instances (including recurring) for the mini calendar period
    const allEventInstances: CalendarEvent[] = [];
    
    this.filteredEvents.forEach(event => {
      if (event.isRecurring && event.recurrence) {
        // Generate recurring instances for this period
        const instances = this.recurrenceService.generateRecurringEvents(
          event, 
          miniCalendarStart, 
          miniCalendarEnd
        );
        allEventInstances.push(...instances);
      } else {
        // Add single events if they fall within the period
        if (event.startDate >= miniCalendarStart && event.startDate <= miniCalendarEnd) {
          allEventInstances.push(event);
        }
      }
    });
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Count events for this date from all instances
      const eventsOnDate = allEventInstances.filter(event => 
        this.isSameDay(event.startDate, date)
      ).length;
      
      dates.push({
        day: date.getDate(),
        date: new Date(date),
        isToday: this.isSameDay(date, today),
        isCurrentMonth: date.getMonth() === month,
        isSelected: this.selectedDate ? this.isSameDay(date, this.selectedDate) : false,
        hasEvents: eventsOnDate > 0,
        eventCount: eventsOnDate
      });
    }
    
    this.miniCalendarDates = dates;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // Event handlers
  private handleDateSelect(selectInfo: any) {
    this.newEvent = {
      title: '',
      description: '',
      date: selectInfo.startStr,
      startTime: '',
      endTime: '',
      allDay: false,
      color: this.categories.length > 0 ? this.categories[0].color : '#dcff00',
      categoryId: this.categories.length > 0 ? this.categories[0].id : '',
      location: '',
      recurrence: undefined,
      notifications: [],
      participants: []
    };
    this.showCreateModal = true;
    this.calendar.unselect();
  }

  private handleEventClick(clickInfo: any) {
    // Close all other modals first
    this.showCreateModal = false;
    this.showCategoryModal = false;
    this.showDeleteConfirmModal = false;
    
    const event = clickInfo.event;
    const isRecurring = event.extendedProps.isRecurringInstance;
    
    // Find the original event in our events array
    let originalEvent: CalendarEvent | null = null;
    if (isRecurring) {
      // For recurring instances, find the original event
      originalEvent = this.events.find(e => e.id === event.extendedProps.parentEventId || 
                                           e.title === event.title) || null;
    } else {
      // For regular events, find by ID
      originalEvent = this.events.find(e => e.id === event.id) || null;
    }
    
    if (originalEvent) {
      this.selectedEvent = originalEvent;
      this.selectedEventIsRecurring = isRecurring;
      this.selectedEventInstance = isRecurring ? event : null;
      this.selectedEventDate = isRecurring ? new Date(event.start) : null;
      this.showEventDetailsModal = true;
      
      // Manually trigger change detection
      this.changeDetectorRef.detectChanges();
    }
  }

  private handleEventDrop(eventInfo: any) {
    console.log('Event moved:', eventInfo.event.title, 'to', eventInfo.event.start);
    // Update our event data
    this.updateEventInArray(eventInfo.event);
  }

  private handleEventResize(eventInfo: any) {
    console.log('Event resized:', eventInfo.event.title, 'end:', eventInfo.event.end);
    // Update our event data
    this.updateEventInArray(eventInfo.event);
  }

  private updateEventInArray(calendarEvent: any) {
    const eventId = calendarEvent.id;
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    
    if (eventIndex !== -1) {
      this.events[eventIndex].startDate = new Date(calendarEvent.start);
      if (calendarEvent.end) {
        this.events[eventIndex].endDate = new Date(calendarEvent.end);
      }
      this.events[eventIndex].updatedAt = new Date();
    }
  }

  private handleNotificationClick(eventId: string) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      // Show event details or navigate to event
      alert(`Event: ${event.title}\nTime: ${event.startDate.toLocaleString()}`);
    }
  }

  // Public methods for template
  openCreateEventModal() {
    // Close all other modals first
    this.showEventDetailsModal = false;
    this.showCategoryModal = false;
    this.showDeleteConfirmModal = false;
    this.showRecurringEditChoiceModal = false;
    
    // Only reset editing context if this is for a new event
    if (!this.isEditingEvent) {
      this.selectedEvent = null;
      this.selectedEventIsRecurring = false;
      this.selectedEventInstance = null;
      this.selectedEventDate = null;
      
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      
      // Reset editing flag for new events
      this.isEditingEvent = false;
      
      this.newEvent = {
        title: '',
        description: '',
        date: `${year}-${month}-${day}`, // HTML date input always expects YYYY-MM-DD format
        startTime: '09:00',
        endTime: '10:00',
        allDay: false,
        color: '#dcff00',
        categoryId: this.categories.length > 0 ? this.categories[0].id : '',
        location: '',
        recurrence: undefined,
        notifications: [], // Start with empty notifications
        participants: []
      };
    }
    
    this.showCreateModal = true;
    
    // Request notification permission if not already granted
    if (this.notificationPermission === 'default') {
      this.notificationService.requestPermission();
    }
  }

  closeCreateEventModal() {
    this.showCreateModal = false;
    this.showRecurrenceOptions = false;
    
    // Reset editing state
    this.isEditingEvent = false;
    this.selectedEvent = null;
    this.selectedEventIsRecurring = false;
    this.selectedEventInstance = null;
    this.selectedEventDate = null;
    this.editType = 'series';
    
    // Reset custom day selector
    this.showCustomDaySelector = false;
    this.selectedDaysOfWeek.clear();
    
    // Reset collapsible sections
    this.showCategorySection = false;
    this.showRecurrenceSection = false;
    this.showNotificationsSection = false;
    this.showParticipantsSection = false;
    
    // Reset participant search
    this.participantSearchQuery = '';
    this.updateFilteredParticipants();
    
    // Reset form to default values
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    this.newEvent = {
      title: '',
      description: '',
      date: `${year}-${month}-${day}`,
      startTime: '09:00',
      endTime: '10:00',
      allDay: false,
      color: '#dcff00',
      categoryId: this.categories.length > 0 ? this.categories[0].id : '',
      location: '',
      recurrence: undefined,
      notifications: [],
      participants: []
    };
    
    // Ensure calendar stays visible after modal close
    setTimeout(() => {
      if (this.calendar) {
        this.calendar.render();
        console.log('🔄 Calendar re-rendered after modal close');
      }
    }, 100);
  }

  /**
   * Creates or updates an event based on current form state
   * 
   * TODO: REPLACE_WITH_API - Event creation and editing
   * Current: Managing events in local array with immediate updates
   * Future: POST /api/events (create) or PUT /api/events/:id (update)
   * 
   * Educational Notes:
   * This method demonstrates several important patterns:
   * 1. Form validation before processing
   * 2. Conditional logic for create vs. edit operations
   * 3. Data transformation from form state to domain objects
   * 4. Immutable state updates
   * 5. User feedback and error handling
   * 6. Complex business logic (recurring events, exclusions)
   */
  createEvent() {
    console.log('=== CREATE EVENT CALLED ===');
    console.log('isEditingEvent:', this.isEditingEvent);
    console.log('editType:', this.editType);
    
    // Validation: Ensure required fields are present
    if (!this.newEvent.title || !this.newEvent.date) {
      console.log('Validation failed: title or date missing');
      alert('Please enter a title and date for the event.');
      return; // Don't close modal if validation fails
    }

    /**
     * Time validation for non-all-day events
     * 
     * Educational Note:
     * Demonstrates client-side validation patterns:
     * - Early return for invalid states
     * - User confirmation for edge cases
     * - Clear error messaging
     */
    if (!this.newEvent.allDay && this.newEvent.startTime && this.newEvent.endTime) {
      if (this.hasNegativeDuration()) {
        console.log('Validation failed: negative duration');
        alert('End time cannot be before or same as start time. Please adjust your times.');
        return;
      }
      
      if (!this.isMinimumDuration()) {
        console.log('Validation warning: very short event');
        const proceed = confirm('This event is very short (less than 1 minute). Do you want to create it anyway?');
        if (!proceed) {
          return;
        }
      }
    }

    /**
     * Date and time object construction
     * 
     * Educational Note:
     * Demonstrates working with JavaScript Date objects:
     * - Parsing HTML date inputs (YYYY-MM-DD format)
     * - Parsing time inputs (HH:MM format)
     * - Combining date and time into single Date objects
     */
    const startDate = new Date(this.newEvent.date);
    if (this.newEvent.startTime && !this.newEvent.allDay) {
      const [hours, minutes] = this.newEvent.startTime.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes));
    }

    let endDate: Date | undefined;
    if (this.newEvent.endTime && !this.newEvent.allDay) {
      endDate = new Date(this.newEvent.date);
      const [hours, minutes] = this.newEvent.endTime.split(':');
      endDate.setHours(parseInt(hours), parseInt(minutes));
    }

    /**
     * Color resolution from category
     * 
     * Educational Note:
     * Demonstrates service integration and fallback patterns:
     * - Service lookup for category colors
     * - Fallback to form color if category not found
     * - Computed text color for accessibility
     */
    const category = this.categoryService.getCategoryById(this.newEvent.categoryId || '');
    const color = category?.color || this.newEvent.color;

    console.log('Checking edit condition...');
    console.log('isEditingEvent && selectedEvent:', this.isEditingEvent && this.selectedEvent);
    
    /**
     * Edit vs. Create Logic Branch
     * 
     * Educational Note:
     * Complex conditional logic handling different user flows:
     * - Editing existing events (series vs. single occurrence)
     * - Creating new events
     * - Recurring event special handling
     */
    if (this.isEditingEvent && this.selectedEvent) {
      console.log('=== UPDATING EXISTING EVENT ===');
      console.log('Updating event with ID:', this.selectedEvent.id);
      console.log('Edit type:', this.editType);
      
      if (this.editType === 'occurrence') {
        console.log('🔄 Creating new event for single occurrence edit');
        
        /**
         * Single occurrence edit handling
         * 
         * Educational Note:
         * When editing a single occurrence of a recurring event:
         * 1. Create a new non-recurring event for this specific date
         * 2. Add the original date to the exclusion list of the recurring series
         * 3. This allows the single occurrence to have different properties
         * 
         * TODO: REPLACE_WITH_API - Occurrence editing
         * Current: Local array manipulation with exclusion dates
         * Future: POST /api/events/:id/occurrences with exclusion handling
         */
        const newOccurrenceEvent: CalendarEvent = {
          id: this.generateEventId(),
          title: this.newEvent.title,
          description: this.newEvent.description,
          startDate,
          endDate,
          allDay: this.newEvent.allDay,
          color,
          textColor: this.getTextColor(color),
          categoryId: this.newEvent.categoryId,
          location: this.newEvent.location,
          recurrence: undefined, // Single occurrence has no recurrence
          notifications: this.newEvent.notifications,
          participants: this.participantsService.getParticipantsByIds(this.newEvent.participants),
          isRecurring: false,
          parentEventId: this.selectedEvent.id, // Reference to original series
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.events.push(newOccurrenceEvent);
        console.log('✅ Created new event for occurrence:', newOccurrenceEvent.title);
        
        /**
         * Exclusion date management
         * 
         * Educational Note:
         * Adding dates to exclusion list prevents the original recurring event
         * from generating an instance on this specific date
         */
        if (this.selectedEventDate && this.selectedEvent) {
          const originalEventIndex = this.events.findIndex(e => e.id === this.selectedEvent!.id);
          if (originalEventIndex !== -1) {
            const originalEvent = this.events[originalEventIndex];
            if (!originalEvent.excludedDates) {
              originalEvent.excludedDates = [];
            }
            // Format date as YYYY-MM-DD for consistent comparison
            const excludeDate = this.selectedEventDate.toISOString().split('T')[0];
            if (!originalEvent.excludedDates.includes(excludeDate)) {
              originalEvent.excludedDates.push(excludeDate);
              console.log('✅ Added exclusion date:', excludeDate, 'to recurring event');
            }
          }
        }
      } else {
        console.log('🔄 Updating entire series');
        
        /**
         * Series edit handling
         * 
         * TODO: REPLACE_WITH_API - Series editing
         * Current: Direct object manipulation in local array
         * Future: PUT /api/events/:id with full event object
         */
        const updatedEvent: CalendarEvent = {
          ...this.selectedEvent,
          title: this.newEvent.title,
          description: this.newEvent.description,
          startDate,
          endDate,
          allDay: this.newEvent.allDay,
          color,
          textColor: this.getTextColor(color),
          categoryId: this.newEvent.categoryId,
          location: this.newEvent.location,
          recurrence: this.newEvent.recurrence,
          notifications: this.newEvent.notifications,
          participants: this.participantsService.getParticipantsByIds(this.newEvent.participants),
          isRecurring: !!this.newEvent.recurrence,
          updatedAt: new Date()
        };

        // Update in events array
        const eventIndex = this.events.findIndex(e => e.id === this.selectedEvent!.id);
        if (eventIndex !== -1) {
          this.events[eventIndex] = updatedEvent;
          console.log('✅ Series updated successfully:', updatedEvent.title);
        } else {
          console.error('Could not find event to update');
          alert('Error updating event. Please try again.');
          return;
        }
      }
    } else {
      console.log('=== CREATING NEW EVENT ===');
      console.log('Reason for new event:');
      console.log('- isEditingEvent:', this.isEditingEvent);
      console.log('- selectedEvent:', this.selectedEvent);
      
      /**
       * New event creation
       * 
       * TODO: REPLACE_WITH_API - New event creation
       * Current: Adding to local events array
       * Future: POST /api/events
       * 
       * Educational Note:
       * Creating a complete CalendarEvent object from form data:
       * - Generated ID (would come from server in real app)
       * - Transformed participant IDs to participant objects
       * - Computed properties (textColor, isRecurring)
       * - Audit fields (createdAt, updatedAt)
       */
      const newEvent: CalendarEvent = {
        id: this.generateEventId(),
        title: this.newEvent.title,
        description: this.newEvent.description,
        startDate,
        endDate,
        allDay: this.newEvent.allDay,
        color,
        textColor: this.getTextColor(color),
        categoryId: this.newEvent.categoryId,
        location: this.newEvent.location,
        recurrence: this.newEvent.recurrence,
        notifications: this.newEvent.notifications,
        participants: this.participantsService.getParticipantsByIds(this.newEvent.participants),
        isRecurring: !!this.newEvent.recurrence,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.events.push(newEvent);
      console.log('Event created successfully:', newEvent.title);
      
      /**
       * Notification scheduling for new events
       * 
       * Educational Note:
       * Integration with notification service for browser notifications
       * This demonstrates service coordination and side effects
       */
      this.notificationService.scheduleEventNotifications(newEvent);
    }
    
    /**
     * UI state refresh after event changes
     * 
     * Educational Note:
     * After modifying event data, several UI updates are needed:
     * 1. Re-filter events based on visible categories
     * 2. Update the FullCalendar display
     * 3. Update mini calendar indicators
     * 4. Close the modal
     */
    console.log('🔄 Refreshing calendar display...');
    console.log('Total events before filtering:', this.events.length);
    console.log('All events:', this.events.map(e => ({ id: e.id, title: e.title, categoryId: e.categoryId, startDate: e.startDate })));
    console.log('Visible categories:', Array.from(this.visibleCategories));
    
    this.filterEvents();
    
    console.log('Filtered events count:', this.filteredEvents.length);
    console.log('Filtered events:', this.filteredEvents.map(e => ({ id: e.id, title: e.title, categoryId: e.categoryId, startDate: e.startDate })));
    
    this.updateCalendarEvents();
    
    console.log('✅ Calendar display refreshed');
    
    // Close modal only after successful save
    this.closeCreateEventModal();
  }

  private generateEventId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private getTextColor(backgroundColor: string): string {
    return backgroundColor === '#dcff00' || backgroundColor === '#5cffe4' || backgroundColor === '#ffc409' 
      ? '#000000' 
      : '#ffffff';
  }

  // Category management
  openCategoryModal() {
    this.newCategory = {
      name: '',
      color: '#dcff00',
      icon: '📅',
      description: ''
    };
    this.showCategoryModal = true;
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
  }

  createCategory() {
    if (!this.newCategory.name || !this.newCategory.name.trim()) {
      alert('Please enter a category name.');
      return; // Don't close modal if validation fails
    }

    try {
      const result = this.categoryService.addCategory({
        name: this.newCategory.name.trim(),
        color: this.newCategory.color,
        icon: this.newCategory.icon || '📅',
        isVisible: true,
        description: this.newCategory.description?.trim() || ''
      });

      console.log('Category created successfully:', result.name);
      this.closeCategoryModal();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
      // Don't close modal on error so user can retry
    }
  }

  toggleCategoryVisibility(categoryId: string) {
    this.categoryService.toggleCategoryVisibility(categoryId);
  }

  deleteCategory(categoryId: string) {
    // Use direct assignment for better performance
    this.categoryToDelete = this.categoryService.getCategoryById(categoryId) || null;
    if (this.categoryToDelete) {
      this.showDeleteConfirmModal = true;
    }
  }

  confirmDeleteCategory() {
    if (!this.categoryToDelete) {
      console.warn('No category selected for deletion');
      this.closeDeleteConfirmModal();
      return;
    }

    const categoryName = this.categoryToDelete.name;
    const categoryId = this.categoryToDelete.id;
    
    // Delete the category
    this.categoryService.deleteCategory(categoryId);
    console.log('Category deleted successfully:', categoryName);
    
    this.closeDeleteConfirmModal();
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.categoryToDelete = null;
  }

  // Recurrence management
  toggleRecurrenceOptions() {
    this.showRecurrenceOptions = !this.showRecurrenceOptions;
  }

  selectRecurrencePreset(preset: { label: string; rule: RecurrenceRule }) {
    this.newEvent.recurrence = { ...preset.rule };
  }

  clearRecurrence() {
    this.newEvent.recurrence = undefined;
    this.showRecurrenceOptions = false;
    this.showCustomDaySelector = false;
    this.selectedDaysOfWeek.clear();
  }

  setRecurrence(type: string) {
    // Reset custom day selector state
    this.showCustomDaySelector = false;
    this.selectedDaysOfWeek.clear();
    
    switch (type) {
      case 'daily':
        this.newEvent.recurrence = {
          frequency: 'daily',
          interval: 1
        };
        // Show custom day selector for daily
        this.showCustomDaySelector = true;
        break;
      case 'weekly':
        this.newEvent.recurrence = {
          frequency: 'weekly',
          interval: 1
        };
        // Show custom day selector for weekly
        this.showCustomDaySelector = true;
        break;
      case 'monthly':
        this.newEvent.recurrence = {
          frequency: 'monthly',
          interval: 1
        };
        break;
      case 'yearly':
        this.newEvent.recurrence = {
          frequency: 'yearly',
          interval: 1
        };
        break;
      case 'weekdays':
        this.newEvent.recurrence = {
          frequency: 'weekly',
          interval: 1,
          daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
        };
        break;
      case 'weekends':
        this.newEvent.recurrence = {
          frequency: 'weekly',
          interval: 1,
          daysOfWeek: [6, 0] // Saturday and Sunday
        };
        break;
      case 'biweekly':
        this.newEvent.recurrence = {
          frequency: 'weekly',
          interval: 2
        };
        // Show custom day selector for biweekly
        this.showCustomDaySelector = true;
        break;
      case 'quarterly':
        this.newEvent.recurrence = {
          frequency: 'monthly',
          interval: 3
        };
        break;
    }
  }

  // Custom day selection methods
  toggleDayOfWeek(day: number) {
    if (this.selectedDaysOfWeek.has(day)) {
      this.selectedDaysOfWeek.delete(day);
    } else {
      this.selectedDaysOfWeek.add(day);
    }
    this.updateRecurrenceWithCustomDays();
  }

  isDaySelected(day: number): boolean {
    return this.selectedDaysOfWeek.has(day);
  }

  private updateRecurrenceWithCustomDays() {
    if (this.newEvent.recurrence && this.selectedDaysOfWeek.size > 0) {
      this.newEvent.recurrence.daysOfWeek = Array.from(this.selectedDaysOfWeek).sort();
    } else if (this.newEvent.recurrence) {
      // Remove daysOfWeek if no days selected
      delete this.newEvent.recurrence.daysOfWeek;
    }
  }

  selectAllWeekdays() {
    this.selectedDaysOfWeek.clear();
    [1, 2, 3, 4, 5].forEach(day => this.selectedDaysOfWeek.add(day));
    this.updateRecurrenceWithCustomDays();
  }

  selectAllWeekends() {
    this.selectedDaysOfWeek.clear();
    [0, 6].forEach(day => this.selectedDaysOfWeek.add(day));
    this.updateRecurrenceWithCustomDays();
  }

  selectAllDays() {
    this.selectedDaysOfWeek.clear();
    [0, 1, 2, 3, 4, 5, 6].forEach(day => this.selectedDaysOfWeek.add(day));
    this.updateRecurrenceWithCustomDays();
  }

  clearDaySelection() {
    this.selectedDaysOfWeek.clear();
    this.updateRecurrenceWithCustomDays();
  }

  getSelectedDayLabels(): string {
    return this.weekDayLabels
      .filter(d => this.isDaySelected(d.day))
      .map(d => d.label)
      .join(', ');
  }

  getRecurrenceDescription(recurrence?: RecurrenceRule): string {
    const rule = recurrence || this.newEvent.recurrence;
    return rule 
      ? this.recurrenceService.getRecurrenceDescription(rule)
      : '';
  }

  // Notification management
  async requestNotificationPermission() {
    // Clear timeout when user enables notifications
    if (this.notificationBannerTimeout) {
      clearTimeout(this.notificationBannerTimeout);
      this.notificationBannerTimeout = null;
    }
    await this.notificationService.requestPermission();
  }

  dismissNotificationBanner() {
    // Clear timeout and dismiss banner
    if (this.notificationBannerTimeout) {
      clearTimeout(this.notificationBannerTimeout);
      this.notificationBannerTimeout = null;
    }
    this.showNotificationPermissionBanner = false;
  }

  addNotification() {
    this.newEvent.notifications.push({
      id: this.generateEventId(),
      type: 'popup',
      timing: 15,
      message: '',
      isEnabled: true
    });
  }

  removeNotification(index: number) {
    this.newEvent.notifications.splice(index, 1);
  }

  getTimingDescription(timing: number): string {
    const preset = this.notificationPresets.find(p => p.timing === timing);
    return preset ? `Notify ${preset.label.toLowerCase()}` : `Notify ${timing} minutes before`;
  }

  addQuickNotification(timing: number) {
    this.newEvent.notifications.push({
      id: this.generateEventId(),
      type: 'popup',
      timing: timing,
      message: '',
      isEnabled: true
    });
  }

  calculateDuration(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return '';
    
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    if (end <= start) return '';
    
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }

  // Time validation methods
  onTimeChange() {
    // Trigger change detection when time values are updated
    this.changeDetectorRef.detectChanges();
  }

  isValidTimeRange(): boolean {
    if (!this.newEvent.startTime || !this.newEvent.endTime) return true;
    
    const start = new Date(`2000-01-01 ${this.newEvent.startTime}`);
    const end = new Date(`2000-01-01 ${this.newEvent.endTime}`);
    
    return end > start;
  }

  hasNegativeDuration(): boolean {
    if (!this.newEvent.startTime || !this.newEvent.endTime) return false;
    
    const start = new Date(`2000-01-01 ${this.newEvent.startTime}`);
    const end = new Date(`2000-01-01 ${this.newEvent.endTime}`);
    
    return end <= start;
  }

  isMinimumDuration(): boolean {
    if (!this.newEvent.startTime || !this.newEvent.endTime) return true;
    
    const start = new Date(`2000-01-01 ${this.newEvent.startTime}`);
    const end = new Date(`2000-01-01 ${this.newEvent.endTime}`);
    
    if (end <= start) return false;
    
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    return diffMins >= 1; // At least 1 minute
  }

  hasTimeValidationError(): boolean {
    return this.hasNegativeDuration();
  }

  // Helper methods for quick duration features
  extendDuration(minutes: number) {
    if (!this.newEvent.startTime) return;
    
    const start = new Date(`2000-01-01 ${this.newEvent.startTime}`);
    start.setMinutes(start.getMinutes() + minutes);
    
    const hours = start.getHours().toString().padStart(2, '0');
    const mins = start.getMinutes().toString().padStart(2, '0');
    
    this.newEvent.endTime = `${hours}:${mins}`;
  }

  suggestEndTime() {
    if (!this.newEvent.startTime) return;
    
    // Suggest 1 hour duration by default
    this.extendDuration(60);
  }

  // Format date in local system format for display
  formatDateLocal(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString();
  }

  // Helper method to ensure date is in correct format for HTML input
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Navigation and view methods (keeping existing functionality)
  navigateToDate(date: Date) {
    this.selectedDate = new Date(date);
    
    // Navigate main calendar to the selected date
    this.calendar.gotoDate(date);
    
    // Update the main calendar's current date
    this.currentMainDate = new Date(date);
    
    // Sync mini calendar if needed
    if (!this.isSameMonth(this.currentMiniDate, date)) {
      this.currentMiniDate = new Date(date);
      this.updateMiniCalendarMonthYear();
    }
    
    this.updateCurrentMonthYear();
    this.generateMiniCalendar();
  }

  previousMonth() {
    this.calendar.prev();
    setTimeout(() => {
      this.currentMainDate = this.calendar.getDate();
      this.updateCurrentMonthYear();
      // Force re-render after navigation
      if (this.calendar) {
        this.calendar.render();
        console.log('⬅️ Calendar re-rendered after previous month');
      }
    }, 0);
  }

  nextMonth() {
    this.calendar.next();
    setTimeout(() => {
      this.currentMainDate = this.calendar.getDate();
      this.updateCurrentMonthYear();
      // Force re-render after navigation
      if (this.calendar) {
        this.calendar.render();
        console.log('➡️ Calendar re-rendered after next month');
      }
    }, 0);
  }

  previousMiniMonth() {
    const newDate = new Date(this.currentMiniDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentMiniDate = newDate;
    this.updateMiniCalendarMonthYear();
    this.generateMiniCalendar();
  }

  nextMiniMonth() {
    const newDate = new Date(this.currentMiniDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentMiniDate = newDate;
    this.updateMiniCalendarMonthYear();
    this.generateMiniCalendar();
  }

  todayView() {
    const today = new Date();
    this.selectedDate = new Date(today);
    this.currentMiniDate = new Date(today);
    this.currentMainDate = new Date(today);
    this.calendar.today();
    this.updateDisplays();
    
    // Force re-render after today navigation
    setTimeout(() => {
      if (this.calendar) {
        this.calendar.render();
        console.log('🏠 Calendar re-rendered after today view');
      }
    }, 100);
  }

  changeView(view: string) {
    this.currentView = view;
    this.calendar.changeView(view);
    
    // Force re-render after view change to prevent disappearing
    setTimeout(() => {
      if (this.calendar) {
        this.calendar.render();
        console.log('👁️ Calendar re-rendered after view change to:', view);
      }
    }, 100);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  clearAllEvents() {
    if (confirm('Are you sure you want to delete all events?')) {
      this.events = [];
      this.calendar.removeAllEvents();
      this.notificationService.clearAllNotifications();
    }
  }

  // TrackBy function for better performance
  trackByCategory(index: number, category: EventCategory): string {
    return category.id;
  }

  // Event details modal methods
  closeEventDetailsModal() {
    this.showEventDetailsModal = false;
    this.showRecurringEditChoiceModal = false;
    
    // Only reset selectedEvent if we're not in editing mode
    if (!this.isEditingEvent) {
      this.selectedEvent = null;
      this.selectedEventIsRecurring = false;
      this.selectedEventInstance = null;
      this.selectedEventDate = null;
    }
    
    console.log('🔄 closeEventDetailsModal called, isEditingEvent:', this.isEditingEvent);
    console.log('🔄 selectedEvent after close:', this.selectedEvent?.id || 'null');
  }

  editSelectedEvent() {
    console.log('=== EDIT SELECTED EVENT CALLED ===');
    
    if (!this.selectedEvent) {
      console.error('No event selected for editing');
      return;
    }
    
    console.log('Editing event:', this.selectedEvent.title, 'ID:', this.selectedEvent.id);
    console.log('Is recurring event instance:', this.selectedEventIsRecurring);
    
    // Set editing flag early to preserve selectedEvent during modal transitions
    this.isEditingEvent = true;
    console.log('✅ Set isEditingEvent to true early in flow');
    
    // Check if this is a recurring event instance
    if (this.selectedEventIsRecurring && this.selectedEvent.isRecurring) {
      console.log('🔄 Showing recurring edit choice modal...');
      // Close event details modal first
      this.closeEventDetailsModal();
      // Show the choice modal
      this.showRecurringEditChoiceModal = true;
      return;
    }
    
    // For non-recurring events or series edits, proceed normally
    this.proceedWithEdit('series'); // 'series' for non-recurring events
  }

  // New method to handle the actual editing process
  proceedWithEdit(editType: 'occurrence' | 'series') {
    console.log('=== PROCEEDING WITH EDIT ===');
    console.log('Edit type:', editType);
    
    if (!this.selectedEvent) {
      console.error('No event selected for editing');
      return;
    }
    
    console.log('✅ Confirmed selectedEvent exists:', this.selectedEvent.id);
    console.log('✅ isEditingEvent is already:', this.isEditingEvent);
    
    // Store the edit type for later use
    this.editType = editType;
    
    // Populate the create event form with the selected event data
    this.newEvent = {
      title: this.selectedEvent.title,
      description: this.selectedEvent.description || '',
      date: this.selectedEventIsRecurring && this.selectedEventDate 
            ? this.formatDateForInput(this.selectedEventDate)
            : this.formatDateForInput(this.selectedEvent.startDate),
      startTime: this.selectedEvent.allDay ? '' : 
                 (this.selectedEventIsRecurring && this.selectedEventDate
                  ? this.selectedEventDate.toTimeString().substring(0, 5)
                  : this.selectedEvent.startDate.toTimeString().substring(0, 5)),
      endTime: this.selectedEvent.allDay ? '' : 
               (this.selectedEventIsRecurring && this.selectedEventDate && this.selectedEvent.endDate
                ? new Date(this.selectedEventDate.getTime() + (this.selectedEvent.endDate.getTime() - this.selectedEvent.startDate.getTime())).toTimeString().substring(0, 5)
                : (this.selectedEvent.endDate?.toTimeString().substring(0, 5) || '')),
      allDay: this.selectedEvent.allDay,
      color: this.selectedEvent.color,
      categoryId: this.selectedEvent.categoryId || '',
      location: this.selectedEvent.location || '',
      recurrence: editType === 'series' ? 
                  (this.selectedEvent.recurrence ? {...this.selectedEvent.recurrence} : undefined) :
                  undefined, // No recurrence for single occurrence edits
      notifications: [...(this.selectedEvent.notifications || [])],
      participants: (this.selectedEvent.participants || []).map(p => p.id)
    };
    
    // Handle custom day selector for events with recurrence
    if (editType === 'series' && this.selectedEvent.recurrence) {
      const recurrence = this.selectedEvent.recurrence;
      
      // Check if this recurrence type should show custom day selector
      if ((recurrence.frequency === 'daily') || 
          (recurrence.frequency === 'weekly' && (!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0)) ||
          (recurrence.frequency === 'weekly' && recurrence.interval === 2)) {
        this.showCustomDaySelector = true;
      }
      
      // Populate selected days if they exist
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        this.selectedDaysOfWeek.clear();
        recurrence.daysOfWeek.forEach(day => this.selectedDaysOfWeek.add(day));
        this.showCustomDaySelector = true;
      }
    }
    
    console.log('✅ Form populated with:', this.newEvent);
    
    // Close choice modal and event details modal but keep selectedEvent
    this.showRecurringEditChoiceModal = false;
    this.showEventDetailsModal = false;
    
    // Open create modal
    console.log('🔄 Opening create modal...');
    this.showCreateModal = true;
    
    console.log('✅ Edit process complete. Final state:');
    console.log('  - showCreateModal:', this.showCreateModal);
    console.log('  - isEditingEvent:', this.isEditingEvent);
    console.log('  - editType:', this.editType);
    console.log('  - selectedEvent ID:', this.selectedEvent?.id);
    console.log('  - showCustomDaySelector:', this.showCustomDaySelector);
    console.log('  - selectedDaysOfWeek:', Array.from(this.selectedDaysOfWeek));
  }

  deleteSelectedEvent(deleteType: 'occurrence' | 'series' = 'occurrence') {
    if (!this.selectedEvent) return;
    
    if (this.selectedEventIsRecurring && deleteType === 'occurrence') {
      // Delete just this occurrence
      if (this.selectedEventInstance) {
        this.selectedEventInstance.remove();
      }
    } else {
      // Delete the entire event/series
      this.events = this.events.filter(e => e.id !== this.selectedEvent!.id);
      this.filterEvents();
      this.updateCalendarEvents();
    }
    
    this.closeEventDetailsModal();
  }

  getEventCategoryName(): string {
    if (!this.selectedEvent?.categoryId) return 'No Category';
    const category = this.categoryService.getCategoryById(this.selectedEvent.categoryId);
    return category ? `${category.icon} ${category.name}` : 'Unknown Category';
  }

  getEventDateTimeDisplay(): string {
    if (!this.selectedEvent) return '';
    
    const startDate = this.selectedEvent.startDate;
    if (this.selectedEvent.allDay) {
      return `${startDate.toLocaleDateString()} (All day)`;
    } else {
      const endDate = this.selectedEvent.endDate;
      const startTime = startDate.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const endTime = endDate?.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return `${startDate.toLocaleDateString()}, ${startTime}${endTime ? ` - ${endTime}` : ''}`;
    }
  }

  hasNotifications(): boolean {
    return !!(this.selectedEvent?.notifications && this.selectedEvent.notifications.length > 0);
  }

  // Recurring edit choice modal methods
  closeRecurringEditChoiceModal() {
    this.showRecurringEditChoiceModal = false;
  }

  editThisOccurrence() {
    console.log('📝 User chose to edit this occurrence only');
    this.closeRecurringEditChoiceModal();
    this.proceedWithEdit('occurrence');
  }

  editEntireSeries() {
    console.log('📝 User chose to edit entire series');
    this.closeRecurringEditChoiceModal();
    this.proceedWithEdit('series');
  }

  // Delete choice modal methods
  initiateDeleteEvent() {
    if (!this.selectedEvent) return;
    
    // Check if this is a recurring event
    if (this.selectedEventIsRecurring && this.selectedEvent.isRecurring) {
      console.log('🗑️ Showing delete choice modal for recurring event...');
      this.showRecurringDeleteChoiceModal = true;
      return;
    }
    
    // For non-recurring events, delete directly
    this.proceedWithDelete('series');
  }

  proceedWithDelete(deleteType: 'occurrence' | 'series') {
    if (!this.selectedEvent) return;
    
    console.log('🗑️ Proceeding with delete:', deleteType);
    
    if (deleteType === 'occurrence' && this.selectedEventInstance) {
      // Delete just this occurrence (remove from calendar)
      this.selectedEventInstance.remove();
      console.log('✅ Deleted occurrence');
    } else {
      // Delete the entire event/series
      this.events = this.events.filter(e => e.id !== this.selectedEvent!.id);
      this.filterEvents();
      this.updateCalendarEvents();
      console.log('✅ Deleted entire series');
    }
    
    // Close all modals
    this.closeEventDetailsModal();
    this.closeRecurringDeleteChoiceModal();
  }

  closeRecurringDeleteChoiceModal() {
    this.showRecurringDeleteChoiceModal = false;
  }

  deleteThisOccurrence() {
    console.log('🗑️ User chose to delete this occurrence only');
    this.closeRecurringDeleteChoiceModal();
    this.proceedWithDelete('occurrence');
  }

  deleteEntireSeries() {
    console.log('🗑️ User chose to delete entire series');
    this.closeRecurringDeleteChoiceModal();
    this.proceedWithDelete('series');
  }

  // Toggle methods for collapsible sections
  toggleCategorySection() {
    this.showCategorySection = !this.showCategorySection;
  }

  toggleRecurrenceSection() {
    this.showRecurrenceSection = !this.showRecurrenceSection;
  }

  toggleNotificationsSection() {
    this.showNotificationsSection = !this.showNotificationsSection;
  }

  toggleParticipantsSection() {
    this.showParticipantsSection = !this.showParticipantsSection;
  }

  // Participant management methods
  updateFilteredParticipants() {
    if (this.participantSearchQuery.trim()) {
      this.filteredParticipants = this.participantsService.searchParticipants(this.participantSearchQuery);
    } else {
      this.filteredParticipants = this.availableParticipants;
    }
  }

  onParticipantSearch() {
    this.updateFilteredParticipants();
  }

  addParticipant(participantId: string) {
    if (!this.newEvent.participants.includes(participantId)) {
      this.newEvent.participants.push(participantId);
    }
  }

  removeParticipant(participantId: string) {
    this.newEvent.participants = this.newEvent.participants.filter(id => id !== participantId);
  }

  isParticipantSelected(participantId: string): boolean {
    return this.newEvent.participants.includes(participantId);
  }

  getSelectedParticipants(): Participant[] {
    return this.participantsService.getParticipantsByIds(this.newEvent.participants);
  }

  clearParticipantSearch() {
    this.participantSearchQuery = '';
    this.updateFilteredParticipants();
  }

  getParticipantStatusIcon(status: string): string {
    switch (status) {
      case 'accepted': return '✅';
      case 'declined': return '❌';
      case 'pending': return '⏳';
      case 'maybe': return '❓';
      default: return '⏳';
    }
  }

  getParticipantStatusColor(status: string): string {
    switch (status) {
      case 'accepted': return 'text-green-600';
      case 'declined': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      case 'maybe': return 'text-blue-600';
      default: return 'text-themed-muted';
    }
  }
} 