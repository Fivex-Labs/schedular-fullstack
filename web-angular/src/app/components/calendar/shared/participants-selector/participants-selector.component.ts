import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Participant } from '../../../../models/calendar.models';
import { ParticipantsService } from '../../../../services/participants.service';

@Component({
  selector: 'app-participants-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participants-selector.component.html',
  styleUrls: ['./participants-selector.component.css']
})
export class ParticipantsSelectorComponent implements OnInit {
  @Input() selectedParticipantIds: string[] = [];
  @Input() collapsible = true;
  @Input() expanded = false;
  
  @Output() participantsChanged = new EventEmitter<string[]>();
  @Output() expandedChanged = new EventEmitter<boolean>();

  searchQuery = '';
  availableParticipants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  
  constructor(private participantsService: ParticipantsService) {}

  ngOnInit() {
    this.participantsService.participants$.subscribe(participants => {
      this.availableParticipants = participants;
      this.updateFilteredParticipants();
    });
  }

  toggleExpanded() {
    if (this.collapsible) {
      this.expanded = !this.expanded;
      this.expandedChanged.emit(this.expanded);
    }
  }

  updateFilteredParticipants() {
    if (this.searchQuery.trim()) {
      this.filteredParticipants = this.participantsService.searchParticipants(this.searchQuery);
    } else {
      this.filteredParticipants = this.availableParticipants;
    }
  }

  onSearchChange() {
    this.updateFilteredParticipants();
  }

  clearSearch() {
    this.searchQuery = '';
    this.updateFilteredParticipants();
  }

  addParticipant(participantId: string) {
    if (!this.selectedParticipantIds.includes(participantId)) {
      const newSelection = [...this.selectedParticipantIds, participantId];
      this.participantsChanged.emit(newSelection);
    }
  }

  removeParticipant(participantId: string) {
    const newSelection = this.selectedParticipantIds.filter(id => id !== participantId);
    this.participantsChanged.emit(newSelection);
  }

  isParticipantSelected(participantId: string): boolean {
    return this.selectedParticipantIds.includes(participantId);
  }

  getSelectedParticipants(): Participant[] {
    return this.participantsService.getParticipantsByIds(this.selectedParticipantIds);
  }

  getParticipantStatusIcon(status?: string): string {
    switch (status) {
      case 'accepted': return '✅';
      case 'declined': return '❌';
      case 'pending': return '⏳';
      case 'maybe': return '❓';
      default: return '⏳';
    }
  }

  getParticipantStatusColor(status?: string): string {
    switch (status) {
      case 'accepted': return 'text-green-600';
      case 'declined': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      case 'maybe': return 'text-blue-600';
      default: return 'text-themed-muted';
    }
  }

  getSelectedCount(): number {
    return this.selectedParticipantIds.length;
  }
} 