import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventNotification, CalendarEvent } from '../models/calendar.models';

interface ScheduledNotification {
  id: string;
  eventId: string;
  notificationId: string;
  scheduledTime: Date;
  timeoutId?: any;
  event: CalendarEvent;
  notification: EventNotification;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly NOTIFICATIONS_KEY = 'schedular-notifications';
  private readonly PERMISSION_KEY = 'schedular-notification-permission';
  
  private scheduledNotifications = new Map<string, ScheduledNotification>();
  private permissionGranted = false;
  
  private notificationStatusSubject = new BehaviorSubject<{
    permission: NotificationPermission;
    supported: boolean;
  }>({
    permission: 'default',
    supported: false
  });

  public notificationStatus$ = this.notificationStatusSubject.asObservable();

  constructor() {
    this.initializeNotifications();
    this.loadScheduledNotifications();
  }

  private async initializeNotifications(): Promise<void> {
    const supported = 'Notification' in window;
    let permission: NotificationPermission = 'default';

    if (supported) {
      permission = Notification.permission;
      this.permissionGranted = permission === 'granted';
    }

    this.notificationStatusSubject.next({ permission, supported });

    if (supported && permission === 'default') {
      // Check if user previously granted permission
      const savedPermission = localStorage.getItem(this.PERMISSION_KEY);
      if (savedPermission === 'granted') {
        await this.requestPermission();
      }
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      localStorage.setItem(this.PERMISSION_KEY, 'granted');
      this.updateNotificationStatus();
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      
      if (this.permissionGranted) {
        localStorage.setItem(this.PERMISSION_KEY, 'granted');
      }
      
      this.updateNotificationStatus();
      return this.permissionGranted;
    }

    return false;
  }

  private updateNotificationStatus(): void {
    this.notificationStatusSubject.next({
      permission: Notification.permission,
      supported: 'Notification' in window
    });
  }

  public scheduleEventNotifications(event: CalendarEvent): void {
    if (!this.permissionGranted || !event.notifications || event.notifications.length === 0) {
      return;
    }

    // Clear existing notifications for this event
    this.clearEventNotifications(event.id);

    event.notifications
      .filter(notification => notification.isEnabled)
      .forEach(notification => {
        this.scheduleNotification(event, notification);
      });
  }

  private scheduleNotification(event: CalendarEvent, notification: EventNotification): void {
    const notificationTime = new Date(event.startDate.getTime() - (notification.timing * 60 * 1000));
    const now = new Date();

    // Don't schedule notifications for past events
    if (notificationTime <= now) {
      return;
    }

    const timeUntilNotification = notificationTime.getTime() - now.getTime();
    const scheduleId = `${event.id}-${notification.id}`;

    const timeoutId = setTimeout(() => {
      this.showNotification(event, notification);
      this.scheduledNotifications.delete(scheduleId);
      this.saveScheduledNotifications();
    }, timeUntilNotification);

    const scheduledNotification: ScheduledNotification = {
      id: scheduleId,
      eventId: event.id,
      notificationId: notification.id,
      scheduledTime: notificationTime,
      timeoutId,
      event,
      notification
    };

    this.scheduledNotifications.set(scheduleId, scheduledNotification);
    this.saveScheduledNotifications();
  }

  private showNotification(event: CalendarEvent, notification: EventNotification): void {
    if (!this.permissionGranted) {
      return;
    }

    const title = this.getNotificationTitle(event, notification);
    const body = this.getNotificationBody(event, notification);
    
    const options: NotificationOptions = {
      body,
      icon: '/assets/icons/calendar-icon.png',
      badge: '/assets/icons/calendar-badge.png',
      tag: `event-${event.id}`,
      requireInteraction: notification.type === 'popup',
      data: {
        eventId: event.id,
        notificationId: notification.id
      }
    };

    const browserNotification = new Notification(title, options);

    browserNotification.onclick = () => {
      this.handleNotificationClick(event);
      browserNotification.close();
    };

    // Auto-close after 10 seconds for non-interactive notifications
    if (notification.type !== 'popup') {
      setTimeout(() => {
        browserNotification.close();
      }, 10000);
    }
  }

  private getNotificationTitle(event: CalendarEvent, notification: EventNotification): string {
    const timingText = this.getTimingText(notification.timing);
    return `${event.title} ${timingText}`;
  }

  private getNotificationBody(event: CalendarEvent, notification: EventNotification): string {
    const startTime = event.startDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    let body = `Starts at ${startTime}`;
    
    if (event.location) {
      body += ` at ${event.location}`;
    }
    
    if (notification.message) {
      body += `\n${notification.message}`;
    }
    
    return body;
  }

  private getTimingText(minutes: number): string {
    if (minutes === 0) return 'starting now';
    if (minutes < 60) return `in ${minutes} minute${minutes === 1 ? '' : 's'}`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `in ${hours} hour${hours === 1 ? '' : 's'}`;
    }
    
    return `in ${hours}h ${remainingMinutes}m`;
  }

  private handleNotificationClick(event: CalendarEvent): void {
    // Focus the window if it's not already focused
    if (window.focus) {
      window.focus();
    }
    
    // Emit event to show event details
    // This could be handled by the calendar component
    window.dispatchEvent(new CustomEvent('notification-click', {
      detail: { eventId: event.id }
    }));
  }

  public clearEventNotifications(eventId: string): void {
    const toRemove: string[] = [];
    
    this.scheduledNotifications.forEach((scheduled, id) => {
      if (scheduled.eventId === eventId) {
        if (scheduled.timeoutId) {
          clearTimeout(scheduled.timeoutId);
        }
        toRemove.push(id);
      }
    });
    
    toRemove.forEach(id => this.scheduledNotifications.delete(id));
    this.saveScheduledNotifications();
  }

  public clearAllNotifications(): void {
    this.scheduledNotifications.forEach(scheduled => {
      if (scheduled.timeoutId) {
        clearTimeout(scheduled.timeoutId);
      }
    });
    
    this.scheduledNotifications.clear();
    this.saveScheduledNotifications();
  }

  public getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  private saveScheduledNotifications(): void {
    const serializable = Array.from(this.scheduledNotifications.values()).map(scheduled => ({
      id: scheduled.id,
      eventId: scheduled.eventId,
      notificationId: scheduled.notificationId,
      scheduledTime: scheduled.scheduledTime,
      event: scheduled.event,
      notification: scheduled.notification
    }));
    
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(serializable));
  }

  private loadScheduledNotifications(): void {
    const saved = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (!saved) return;

    try {
      const notifications = JSON.parse(saved);
      const now = new Date();

      notifications.forEach((saved: any) => {
        const scheduledTime = new Date(saved.scheduledTime);
        
        // Only reschedule future notifications
        if (scheduledTime > now) {
          this.scheduleNotification(saved.event, saved.notification);
        }
      });
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
      localStorage.removeItem(this.NOTIFICATIONS_KEY);
    }
  }

  public createDefaultNotifications(): EventNotification[] {
    return [
      {
        id: this.generateId(),
        type: 'popup',
        timing: 15,
        message: '',
        isEnabled: true
      }
    ];
  }

  public getNotificationPresets(): { timing: number; label: string }[] {
    return [
      { timing: 0, label: 'At event time' },
      { timing: 5, label: '5 minutes before' },
      { timing: 15, label: '15 minutes before' },
      { timing: 30, label: '30 minutes before' },
      { timing: 60, label: '1 hour before' },
      { timing: 120, label: '2 hours before' },
      { timing: 1440, label: '1 day before' },
      { timing: 10080, label: '1 week before' }
    ];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
} 