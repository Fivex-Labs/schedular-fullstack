import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniCalendarDate, CalendarEvent } from '../../../models/calendar.models';

@Component({
  selector: 'app-mini-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-calendar.component.html',
  styleUrls: ['./mini-calendar.component.css']
})
export class MiniCalendarComponent implements OnInit, OnChanges {
  @Input() currentDate = new Date();
  @Input() selectedDate: Date | null = null;
  @Input() events: CalendarEvent[] = [];
  
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<Date>();

  monthYear = '';
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  miniCalendarDates: MiniCalendarDate[] = [];

  ngOnInit() {
    this.updateDisplay();
    this.generateMiniCalendar();
  }

  ngOnChanges() {
    this.updateDisplay();
    this.generateMiniCalendar();
  }

  private updateDisplay() {
    this.monthYear = this.currentDate.toLocaleDateString(undefined, { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  private generateMiniCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates: MiniCalendarDate[] = [];
    const today = new Date();
    
    // Get date range for mini calendar (6 weeks)
    const miniCalendarStart = new Date(startDate);
    const miniCalendarEnd = new Date(startDate);
    miniCalendarEnd.setDate(miniCalendarEnd.getDate() + 42);
    
    // Generate all event instances for this period
    const eventsInPeriod = this.events.filter(event => {
      const eventDate = event.startDate;
      return eventDate >= miniCalendarStart && eventDate <= miniCalendarEnd;
    });
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Count events for this date
      const eventsOnDate = eventsInPeriod.filter(event => 
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

  selectDate(date: Date) {
    this.selectedDate = new Date(date);
    this.generateMiniCalendar(); // Regenerate to update selected state
    this.dateSelected.emit(new Date(date));
  }

  previousMonth() {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentDate = newDate;
    this.updateDisplay();
    this.generateMiniCalendar();
    this.monthChanged.emit(new Date(newDate));
  }

  nextMonth() {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentDate = newDate;
    this.updateDisplay();
    this.generateMiniCalendar();
    this.monthChanged.emit(new Date(newDate));
  }
} 