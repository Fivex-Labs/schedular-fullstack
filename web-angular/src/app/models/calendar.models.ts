/**
 * Calendar Models - TypeScript Interface Definitions
 * 
 * Educational Purpose:
 * This file demonstrates TypeScript interface design patterns and data modeling:
 * 1. Interface composition and relationships
 * 2. Optional vs required properties
 * 3. Union types for controlled values
 * 4. Data normalization strategies
 * 5. Form vs domain object separation
 * 
 * Key Learning Points:
 * - How to design clean, maintainable data structures
 * - TypeScript interface best practices
 * - Data modeling for complex applications
 * - Separation of concerns in data representation
 */

/**
 * EventCategory Interface
 * 
 * Educational Note:
 * Represents event categories for organizing and filtering events
 * - Uses string ID for flexibility (could be UUID from backend)
 * - Color property enables visual categorization
 * - isVisible allows category-based filtering
 * - Optional description provides additional context
 * 
 * Usage: Category management, event filtering, UI theming
 */
export interface EventCategory {
  id: string;                    // Unique identifier for the category
  name: string;                  // Display name (e.g., "Work", "Personal")
  color: string;                 // Hex color code for visual representation
  icon: string;                  // Emoji or icon identifier for UI
  isVisible: boolean;            // Whether events in this category are shown
  description?: string;          // Optional detailed description
}

/**
 * Participant Interface
 * 
 * Educational Note:
 * Represents people who can be invited to events
 * - Includes contact information and organizational data
 * - Avatar URL for visual representation
 * - Status tracking for invitation responses
 * - Optional properties allow flexible participant data
 * 
 * Usage: Event invitations, participant management, status tracking
 */
export interface Participant {
  id: string;                    // Unique participant identifier
  name: string;                  // Full display name
  email: string;                 // Contact email address
  avatar: string;                // Profile picture URL
  role?: string;                 // Job title or role (optional)
  department?: string;           // Organizational department (optional)
  status?: 'accepted' | 'declined' | 'pending' | 'maybe'; // Invitation status
}

/**
 * RecurrenceRule Interface
 * 
 * Educational Note:
 * Defines how events repeat over time
 * - Frequency determines the base repetition pattern
 * - Interval allows "every X" patterns (e.g., every 2 weeks)
 * - Optional properties enable complex recurrence rules
 * - Supports both count-based and date-based endings
 * 
 * Usage: Recurring event generation, calendar calculations
 */
export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; // Base repetition type
  interval: number;              // Every X days/weeks/months/years
  daysOfWeek?: number[];         // For weekly: 0=Sunday, 1=Monday, etc.
  dayOfMonth?: number;           // For monthly: specific day of month
  monthOfYear?: number;          // For yearly: specific month (0-11)
  endDate?: Date;                // When recurrence stops (optional)
  count?: number;                // Number of occurrences (alternative to endDate)
}

/**
 * EventNotification Interface
 * 
 * Educational Note:
 * Represents notification settings for events
 * - Multiple notification types for different delivery methods
 * - Timing in minutes allows flexible scheduling
 * - Custom messages enable personalized notifications
 * - isEnabled allows users to toggle notifications
 * 
 * Usage: Browser notifications, email reminders, push notifications
 */
export interface EventNotification {
  id: string;                    // Unique notification identifier
  type: 'popup' | 'email' | 'push'; // Delivery method
  timing: number;                // Minutes before event to trigger
  message: string;               // Custom notification text
  isEnabled: boolean;            // Whether this notification is active
}

/**
 * CalendarEvent Interface - Main Event Data Structure
 * 
 * Educational Note:
 * The core event entity with all event information
 * - Combines date/time, categorization, and metadata
 * - Supports both single and recurring events
 * - Includes audit fields for tracking changes
 * - Optional properties provide flexibility
 * - References to related entities (categories, participants)
 * 
 * Usage: Event storage, calendar display, event management
 */
export interface CalendarEvent {
  id: string;                    // Unique event identifier
  title: string;                 // Event title/name
  description?: string;          // Detailed event description (optional)
  startDate: Date;               // Event start date and time
  endDate?: Date;                // Event end date and time (optional for all-day)
  allDay: boolean;               // Whether event spans entire day
  color: string;                 // Display color (usually from category)
  textColor: string;             // Text color for contrast
  categoryId?: string;           // Reference to event category
  location?: string;             // Event location (optional)
  recurrence?: RecurrenceRule;   // Recurrence pattern (optional)
  notifications?: EventNotification[]; // Associated notifications
  participants?: Participant[];  // Invited participants
  isRecurring: boolean;          // Whether this event repeats
  parentEventId?: string;        // For recurring instances, reference to parent
  excludedDates?: string[];      // Dates to skip in recurrence (YYYY-MM-DD)
  createdAt: Date;               // When event was created (audit field)
  updatedAt: Date;               // When event was last modified (audit field)
}

/**
 * MiniCalendarDate Interface
 * 
 * Educational Note:
 * Represents a single date in the mini calendar component
 * - Combines date data with display state
 * - Includes event indicators for visual feedback
 * - Boolean flags for different visual states
 * - Demonstrates component-specific data modeling
 * 
 * Usage: Mini calendar rendering, date selection, event indicators
 */
export interface MiniCalendarDate {
  day: number;                   // Day of month (1-31)
  date: Date;                    // Full date object
  isToday: boolean;              // Whether this is today's date
  isCurrentMonth: boolean;       // Whether date belongs to displayed month
  isSelected: boolean;           // Whether user has selected this date
  hasEvents?: boolean;           // Whether there are events on this date
  eventCount?: number;           // Number of events on this date
}

/**
 * NewEvent Interface - Form Data Structure
 * 
 * Educational Note:
 * Represents event data in form state (before conversion to CalendarEvent)
 * - String-based date/time for HTML form compatibility
 * - Participant IDs instead of full objects (for form efficiency)
 * - Simplified structure for form binding
 * - Demonstrates separation between form data and domain objects
 * 
 * Usage: Event creation/editing forms, form validation, data binding
 */
export interface NewEvent {
  title: string;                 // Event title
  description: string;           // Event description
  date: string;                  // Date in YYYY-MM-DD format (HTML date input)
  startTime: string;             // Time in HH:MM format (HTML time input)
  endTime: string;               // End time in HH:MM format
  allDay: boolean;               // All-day event flag
  color: string;                 // Event color
  categoryId: string;            // Selected category ID
  location: string;              // Event location
  recurrence?: RecurrenceRule;   // Recurrence settings (optional)
  notifications: EventNotification[]; // Notification settings
  participants: string[];        // Array of participant IDs (not full objects)
}

/**
 * Data Flow Example:
 * 
 * 1. User fills out form → NewEvent interface
 * 2. Form submission → Convert NewEvent to CalendarEvent
 * 3. Save to storage → CalendarEvent with generated ID and timestamps
 * 4. Display in calendar → CalendarEvent rendered with FullCalendar
 * 5. Mini calendar → MiniCalendarDate objects with event indicators
 * 
 * This separation allows for:
 * - Clean form handling
 * - Type safety throughout the application
 * - Easy data transformation
 * - Flexible storage and display options
 */ 