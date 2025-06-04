import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    }
  ]
})
export class TimeInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'start' | 'end' = 'start';
  @Input() icon = '🕐';
  @Input() placeholder = '09:00';
  @Input() disabled = false;
  @Input() startTime?: string;
  @Input() endTime?: string;
  @Input() showDuration = false;
  
  @Output() timeChange = new EventEmitter<string>();
  @Output() durationCalculated = new EventEmitter<string>();

  value = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onTimeChange(): void {
    this.onChange(this.value);
    this.timeChange.emit(this.value);
    
    if (this.showDuration && this.startTime && this.endTime) {
      const duration = this.calculateDuration(this.startTime, this.endTime);
      this.durationCalculated.emit(duration);
    }
  }

  onBlur(): void {
    this.onTouched();
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

  isValidTimeRange(): boolean {
    if (!this.startTime || !this.endTime) return true;
    
    const start = new Date(`2000-01-01 ${this.startTime}`);
    const end = new Date(`2000-01-01 ${this.endTime}`);
    
    return end > start;
  }

  hasNegativeDuration(): boolean {
    if (!this.startTime || !this.endTime) return false;
    
    const start = new Date(`2000-01-01 ${this.startTime}`);
    const end = new Date(`2000-01-01 ${this.endTime}`);
    
    return end <= start;
  }

  extendDuration(minutes: number): void {
    if (!this.value) return;
    
    const start = new Date(`2000-01-01 ${this.value}`);
    start.setMinutes(start.getMinutes() + minutes);
    
    const hours = start.getHours().toString().padStart(2, '0');
    const mins = start.getMinutes().toString().padStart(2, '0');
    
    this.value = `${hours}:${mins}`;
    this.onTimeChange();
  }
} 