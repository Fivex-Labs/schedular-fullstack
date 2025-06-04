import { Injectable } from '@angular/core';
import { CalendarEvent, RecurrenceRule } from '../models/calendar.models';

@Injectable({
  providedIn: 'root'
})
export class RecurrenceService {

  constructor() {}

  /**
   * Generate recurring event instances based on a recurrence rule
   */
  public generateRecurringEvents(
    baseEvent: CalendarEvent, 
    startDate: Date, 
    endDate: Date
  ): CalendarEvent[] {
    if (!baseEvent.recurrence || !baseEvent.isRecurring) {
      return [baseEvent];
    }

    const instances: CalendarEvent[] = [];
    const rule = baseEvent.recurrence;
    let currentDate = new Date(baseEvent.startDate);
    let occurrenceCount = 0;

    // Ensure we don't generate too many instances (safety limit)
    const maxInstances = rule.count || 1000;

    while (currentDate <= endDate && occurrenceCount < maxInstances) {
      // Check if this occurrence should be included
      if (currentDate >= startDate) {
        // Format current date for exclusion check
        const currentDateStr = currentDate.toISOString().split('T')[0];
        
        // Skip this occurrence if it's in the excluded dates
        if (!baseEvent.excludedDates || !baseEvent.excludedDates.includes(currentDateStr)) {
          const instance = this.createEventInstance(baseEvent, currentDate, occurrenceCount);
          instances.push(instance);
        } else {
          console.log('🚫 Skipping excluded date:', currentDateStr);
        }
      }

      // Move to next occurrence
      currentDate = this.getNextOccurrence(currentDate, rule);
      occurrenceCount++;

      // Stop if we've reached the end date or max occurrences
      if (rule.endDate && currentDate > rule.endDate) {
        break;
      }

      // Safety check to prevent infinite loops
      if (occurrenceCount > 10000) {
        console.warn('Recurrence generation stopped: too many occurrences');
        break;
      }
    }

    return instances;
  }

  private createEventInstance(baseEvent: CalendarEvent, occurrenceDate: Date, index: number): CalendarEvent {
    const duration = baseEvent.endDate 
      ? baseEvent.endDate.getTime() - baseEvent.startDate.getTime()
      : 0;

    const startDate = new Date(occurrenceDate);
    const endDate = baseEvent.endDate ? new Date(occurrenceDate.getTime() + duration) : undefined;

    return {
      ...baseEvent,
      id: `${baseEvent.id}-${index}`,
      startDate,
      endDate,
      parentEventId: baseEvent.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private getNextOccurrence(currentDate: Date, rule: RecurrenceRule): Date {
    let nextDate = new Date(currentDate);

    switch (rule.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + rule.interval);
        break;

      case 'weekly':
        if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
          nextDate = this.getNextWeeklyOccurrence(nextDate, rule);
        } else {
          nextDate.setDate(nextDate.getDate() + (7 * rule.interval));
        }
        break;

      case 'monthly':
        if (rule.dayOfMonth) {
          nextDate = this.getNextMonthlyByDate(nextDate, rule);
        } else {
          nextDate.setMonth(nextDate.getMonth() + rule.interval);
        }
        break;

      case 'yearly':
        if (rule.monthOfYear !== undefined) {
          nextDate = this.getNextYearlyOccurrence(nextDate, rule);
        } else {
          nextDate.setFullYear(nextDate.getFullYear() + rule.interval);
        }
        break;
    }

    return nextDate;
  }

  private getNextWeeklyOccurrence(currentDate: Date, rule: RecurrenceRule): Date {
    if (!rule.daysOfWeek || rule.daysOfWeek.length === 0) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + (7 * rule.interval));
      return nextDate;
    }

    const sortedDays = [...rule.daysOfWeek].sort((a, b) => a - b);
    const currentDay = currentDate.getDay();
    
    // Find the next day in the current week
    const nextDayInWeek = sortedDays.find(day => day > currentDay);
    
    if (nextDayInWeek !== undefined) {
      // Next occurrence is in the same week
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + (nextDayInWeek - currentDay));
      return nextDate;
    } else {
      // Move to the first day of the next interval
      const daysUntilNextWeek = (7 - currentDay) + sortedDays[0] + ((rule.interval - 1) * 7);
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + daysUntilNextWeek);
      return nextDate;
    }
  }

  private getNextMonthlyByDate(currentDate: Date, rule: RecurrenceRule): Date {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + rule.interval);
    
    if (rule.dayOfMonth) {
      // Handle month end scenarios (e.g., Jan 31 -> Feb 28)
      const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
      const targetDay = Math.min(rule.dayOfMonth, lastDayOfMonth);
      nextDate.setDate(targetDay);
    }
    
    return nextDate;
  }

  private getNextYearlyOccurrence(currentDate: Date, rule: RecurrenceRule): Date {
    const nextDate = new Date(currentDate);
    nextDate.setFullYear(nextDate.getFullYear() + rule.interval);
    
    if (rule.monthOfYear !== undefined) {
      nextDate.setMonth(rule.monthOfYear);
    }
    
    if (rule.dayOfMonth) {
      const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
      const targetDay = Math.min(rule.dayOfMonth, lastDayOfMonth);
      nextDate.setDate(targetDay);
    }
    
    return nextDate;
  }

  /**
   * Create a human-readable description of the recurrence rule
   */
  public getRecurrenceDescription(rule: RecurrenceRule): string {
    if (!rule) return '';

    const interval = rule.interval > 1 ? rule.interval : '';
    const intervalText = interval ? ` ${interval}` : '';

    switch (rule.frequency) {
      case 'daily':
        if (rule.interval === 1) return 'Daily';
        return `Every${intervalText} days`;

      case 'weekly':
        if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
          const dayNames = rule.daysOfWeek.map(day => this.getDayName(day)).join(', ');
          if (rule.interval === 1) {
            return `Weekly on ${dayNames}`;
          }
          return `Every${intervalText} weeks on ${dayNames}`;
        }
        if (rule.interval === 1) return 'Weekly';
        return `Every${intervalText} weeks`;

      case 'monthly':
        if (rule.dayOfMonth) {
          const suffix = this.getOrdinalSuffix(rule.dayOfMonth);
          if (rule.interval === 1) {
            return `Monthly on the ${rule.dayOfMonth}${suffix}`;
          }
          return `Every${intervalText} months on the ${rule.dayOfMonth}${suffix}`;
        }
        if (rule.interval === 1) return 'Monthly';
        return `Every${intervalText} months`;

      case 'yearly':
        if (rule.monthOfYear !== undefined && rule.dayOfMonth) {
          const monthName = this.getMonthName(rule.monthOfYear);
          const suffix = this.getOrdinalSuffix(rule.dayOfMonth);
          if (rule.interval === 1) {
            return `Yearly on ${monthName} ${rule.dayOfMonth}${suffix}`;
          }
          return `Every${intervalText} years on ${monthName} ${rule.dayOfMonth}${suffix}`;
        }
        if (rule.interval === 1) return 'Yearly';
        return `Every${intervalText} years`;

      default:
        return 'Custom recurrence';
    }
  }

  private getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] || 'Unknown';
  }

  private getMonthName(monthIndex: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex] || 'Unknown';
  }

  private getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  /**
   * Get common recurrence presets for UI
   */
  public getRecurrencePresets(): { label: string; rule: RecurrenceRule }[] {
    return [
      {
        label: 'Daily',
        rule: { frequency: 'daily', interval: 1 }
      },
      {
        label: 'Weekly',
        rule: { frequency: 'weekly', interval: 1 }
      },
      {
        label: 'Monthly',
        rule: { frequency: 'monthly', interval: 1 }
      },
      {
        label: 'Yearly',
        rule: { frequency: 'yearly', interval: 1 }
      },
      {
        label: 'Weekdays (Mon-Fri)',
        rule: { frequency: 'weekly', interval: 1, daysOfWeek: [1, 2, 3, 4, 5] }
      },
      {
        label: 'Weekends (Sat-Sun)',
        rule: { frequency: 'weekly', interval: 1, daysOfWeek: [0, 6] }
      },
      {
        label: 'Every 2 weeks',
        rule: { frequency: 'weekly', interval: 2 }
      },
      {
        label: 'Every 3 months',
        rule: { frequency: 'monthly', interval: 3 }
      }
    ];
  }
} 