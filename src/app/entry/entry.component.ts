import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Entry, createEmptyEntry } from '../models/entry';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent {
  @Input() entry!: Entry;
  @Input() depth: number = 0;
  @Output() entryChanged = new EventEmitter<void>();
  @Output() entryDeleted = new EventEmitter<string>();

  // УБРАЛИ ПРОВЕРКУ ГЛУБИНЫ - можно добавлять бесконечно
  addSubEntry(): void {
    this.entry.entries.push(createEmptyEntry('Новая подзапись'));
    this.entry.isExpanded = true;
    this.entryChanged.emit();
  }

  deleteEntry(): void {
    this.entryDeleted.emit(this.entry.id);
  }

  onSubEntryDeleted(subEntryId: string): void {
    this.entry.entries = this.entry.entries.filter(e => e.id !== subEntryId);
    this.entryChanged.emit();
  }

  toggleExpand(): void {
    this.entry.isExpanded = !this.entry.isExpanded;
  }

  onSubEntryChanged(): void {
    this.entryChanged.emit();
  }

  // ВСЕГДА МОЖНО ДОБАВЛЯТЬ ПОДЗАПИСИ
  get canAddSubEntry(): boolean {
    return true;
  }

  // Динамический отступ вместо классов
  get marginLeft(): string {
    return (this.depth * 25) + 'px';
  }
}