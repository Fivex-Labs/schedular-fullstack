import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Participant } from '../models/calendar.models';

/**
 * ParticipantsService - Event Participants Management Service
 * 
 * Educational Purpose:
 * This service demonstrates key concepts for managing participant data:
 * 1. In-memory data store with hardcoded test data
 * 2. Array manipulation methods for CRUD operations
 * 3. Search and filtering implementations
 * 4. Observable pattern for reactive updates
 * 5. Data transformation and aggregation techniques
 * 
 * Key Learning Points:
 * - Array methods: filter, find, map, sort, includes
 * - String manipulation for search functionality
 * - Set operations for unique value collection
 * - Type guards for handling optional properties
 * - Random selection algorithms
 */
@Injectable({
  providedIn: 'root' // Singleton service available throughout the app
})
export class ParticipantsService {
  /**
   * Hardcoded participant data for demonstration
   * 
   * TODO: REPLACE_WITH_API - Load participants from backend
   * Current: Hardcoded array with sample data
   * Future: GET /api/participants
   * 
   * Educational Notes:
   * - Uses DiceBear API for consistent avatar generation
   * - Demonstrates diverse data with different departments and roles
   * - Shows different participant statuses for realistic scenarios
   * - Avatar URLs use seed-based generation for consistent results
   */
  private participants: Participant[] = [
    {
      id: 'p1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      // DiceBear avatars - consistent, diverse, and free for demo purposes
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4&clothesColor=262e33',
      role: 'Product Manager',
      department: 'Product',
      status: 'accepted' // Demonstrates "accepted" invitation status
    },
    {
      id: 'p2',
      name: 'Marcus Chen',
      email: 'marcus.chen@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede&clothesColor=3c4f5c',
      role: 'Senior Developer',
      department: 'Engineering',
      status: 'accepted'
    },
    {
      id: 'p3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffd93d&clothesColor=ff488e',
      role: 'UX Designer',
      department: 'Design',
      status: 'pending' // Demonstrates "pending" invitation status
    },
    {
      id: 'p4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=a7f3d0&clothesColor=65c3c8',
      role: 'Marketing Director',
      department: 'Marketing',
      status: 'accepted'
    },
    {
      id: 'p5',
      name: 'Aisha Patel',
      email: 'aisha.patel@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha&backgroundColor=fecaca&clothesColor=ffffff',
      role: 'Data Analyst',
      department: 'Analytics',
      status: 'maybe' // Demonstrates "maybe" invitation status
    },
    {
      id: 'p6',
      name: 'James Wilson',
      email: 'james.wilson@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=bfdbfe&clothesColor=1f2937',
      role: 'DevOps Engineer',
      department: 'Engineering',
      status: 'accepted'
    },
    {
      id: 'p7',
      name: 'Maria Garcia',
      email: 'maria.garcia@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=e0e7ff&clothesColor=059669',
      role: 'HR Manager',
      department: 'Human Resources',
      status: 'accepted'
    },
    {
      id: 'p8',
      name: 'Alex Thompson',
      email: 'alex.thompson@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=f3e8ff&clothesColor=7c3aed',
      role: 'Sales Lead',
      department: 'Sales',
      status: 'declined' // Demonstrates "declined" invitation status
    },
    {
      id: 'p9',
      name: 'Zara Ahmed',
      email: 'zara.ahmed@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=fed7d7&clothesColor=2563eb',
      role: 'Content Strategist',
      department: 'Marketing',
      status: 'pending'
    },
    {
      id: 'p10',
      name: 'Ryan O\'Connor',
      email: 'ryan.oconnor@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan&backgroundColor=ecfdf5&clothesColor=dc2626',
      role: 'QA Engineer',
      department: 'Engineering',
      status: 'accepted'
    },
    {
      id: 'p11',
      name: 'Lisa Zhang',
      email: 'lisa.zhang@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=f0f9ff&clothesColor=ea580c',
      role: 'Finance Manager',
      department: 'Finance',
      status: 'accepted'
    },
    {
      id: 'p12',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=fffbeb&clothesColor=16a34a',
      role: 'Customer Success',
      department: 'Support',
      status: 'maybe'
    }
  ];

  /**
   * Observable state management for reactive updates
   * 
   * Educational Note:
   * BehaviorSubject allows components to subscribe to participant changes
   * This enables real-time updates when participant data changes
   */
  private participantsSubject = new BehaviorSubject<Participant[]>(this.participants);
  public participants$ = this.participantsSubject.asObservable();

  constructor() {
    // TODO: REPLACE_WITH_API - Initialize service with API call
    // Current: Using hardcoded data
    // Future: this.loadParticipantsFromAPI()
  }

  /**
   * Gets all participants
   * 
   * Educational Note:
   * Simple getter method that returns the current array
   * In a real app, this might involve caching or filtering logic
   * 
   * @returns Array of all participants
   */
  getAllParticipants(): Participant[] {
    return this.participants;
  }

  /**
   * Finds a participant by their unique ID
   * 
   * Educational Notes:
   * - Array.find() returns first match or undefined
   * - More efficient than filter()[0] for single item lookup
   * - Uses strict equality (===) for ID comparison
   * 
   * @param id Unique participant identifier
   * @returns Participant object or undefined if not found
   */
  getParticipantById(id: string): Participant | undefined {
    return this.participants.find(p => p.id === id);
  }

  /**
   * Gets multiple participants by their IDs
   * 
   * Educational Notes:
   * - Array.filter() with Array.includes() for multiple matches
   * - Useful for retrieving selected participants for events
   * - Returns empty array if no matches found
   * 
   * @param ids Array of participant IDs to retrieve
   * @returns Array of matching participants
   */
  getParticipantsByIds(ids: string[]): Participant[] {
    return this.participants.filter(p => ids.includes(p.id));
  }

  /**
   * Searches participants by name, email, role, or department
   * 
   * Educational Notes:
   * - Case-insensitive search using toLowerCase()
   * - Multiple field search with OR logic
   * - String.includes() for partial matching
   * - Optional chaining (?.) for safe property access
   * 
   * @param query Search term to match against participant fields
   * @returns Array of participants matching the search criteria
   */
  searchParticipants(query: string): Participant[] {
    const lowercaseQuery = query.toLowerCase();
    return this.participants.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.email.toLowerCase().includes(lowercaseQuery) ||
      p.role?.toLowerCase().includes(lowercaseQuery) ||
      p.department?.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Filters participants by department
   * 
   * Educational Note:
   * Simple filtering for grouping participants by organizational structure
   * Useful for department-specific meetings or reports
   * 
   * @param department Department name to filter by
   * @returns Array of participants in the specified department
   */
  getParticipantsByDepartment(department: string): Participant[] {
    return this.participants.filter(p => p.department === department);
  }

  /**
   * Updates a participant's invitation status
   * 
   * TODO: REPLACE_WITH_API - Update participant status on backend
   * Current: Updating local array and notifying observers
   * Future: PUT /api/participants/:id/status
   * 
   * Educational Notes:
   * - Array.find() to locate the participant
   * - Direct property mutation (acceptable for this pattern)
   * - Spread operator creates new array for immutable update pattern
   * - BehaviorSubject.next() notifies all subscribers
   * 
   * @param participantId ID of participant to update
   * @param status New invitation status
   */
  updateParticipantStatus(participantId: string, status: 'accepted' | 'declined' | 'pending' | 'maybe'): void {
    const participant = this.participants.find(p => p.id === participantId);
    if (participant) {
      participant.status = status;
      // Notify subscribers of the change with a new array reference
      this.participantsSubject.next([...this.participants]);
    }
    // TODO: REPLACE_WITH_API - Send status update to backend
  }

  /**
   * Selects random participants for demo purposes
   * 
   * Educational Notes:
   * - Fisher-Yates shuffle algorithm simplified with Array.sort()
   * - Math.random() - 0.5 creates random positive/negative values
   * - Array.slice() for safe array truncation
   * - Spread operator [...array] creates copy before sorting
   * 
   * @param count Number of random participants to select
   * @returns Array of randomly selected participants
   */
  getRandomParticipants(count: number): Participant[] {
    // Create a copy and shuffle it using random sort
    const shuffled = [...this.participants].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Gets unique list of all departments
   * 
   * Educational Notes:
   * - Set automatically handles uniqueness
   * - Array.map() extracts department values
   * - Array.filter() with type guard removes undefined values
   * - Type guard (dept): dept is string ensures type safety
   * - Array.from() converts Set back to Array
   * - Array.sort() alphabetizes the result
   * 
   * @returns Sorted array of unique department names
   */
  getDepartments(): string[] {
    const departments = new Set(
      this.participants
        .map(p => p.department)
        .filter((dept): dept is string => dept !== undefined)
    );
    return Array.from(departments).sort();
  }

  /**
   * Future method for adding new participants
   * 
   * TODO: REPLACE_WITH_API - Add participant to backend
   * Current: Method not implemented (would push to local array)
   * Future: POST /api/participants
   */
  // addParticipant(participant: Omit<Participant, 'id'>): Participant {
  //   const newParticipant = {
  //     ...participant,
  //     id: this.generateId()
  //   };
  //   this.participants.push(newParticipant);
  //   this.participantsSubject.next([...this.participants]);
  //   return newParticipant;
  // }

  /**
   * Future method for removing participants
   * 
   * TODO: REPLACE_WITH_API - Remove participant from backend
   * Current: Method not implemented (would filter local array)
   * Future: DELETE /api/participants/:id
   */
  // removeParticipant(id: string): boolean {
  //   const initialLength = this.participants.length;
  //   this.participants = this.participants.filter(p => p.id !== id);
  //   const removed = this.participants.length < initialLength;
  //   if (removed) {
  //     this.participantsSubject.next([...this.participants]);
  //   }
  //   return removed;
  // }
}

/**
 * Usage Examples for Learning:
 * 
 * 1. Inject service in component:
 * constructor(private participantsService: ParticipantsService) {}
 * 
 * 2. Subscribe to participants changes:
 * this.participantsService.participants$.subscribe(participants => {
 *   this.availableParticipants = participants;
 * });
 * 
 * 3. Search for participants:
 * const results = this.participantsService.searchParticipants('john');
 * 
 * 4. Get participants by department:
 * const engineers = this.participantsService.getParticipantsByDepartment('Engineering');
 * 
 * 5. Update participant status:
 * this.participantsService.updateParticipantStatus('p1', 'accepted');
 * 
 * 6. Get random participants for an event:
 * const randomInvitees = this.participantsService.getRandomParticipants(5);
 */ 