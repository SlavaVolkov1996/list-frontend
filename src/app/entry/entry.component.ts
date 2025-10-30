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

  // Добавление подзаписи
  addSubEntry(): void {
    const newEntry = createEmptyEntry('Новая подзапись');
    this.entry.entries.push(newEntry);
    this.entry.isExpanded = true;
    this.entryChanged.emit();
  }

  // Удаление с подтверждением
  deleteEntry(): void {
    const entryName = this.entry.title || 'безымянная запись';
    const subEntriesCount = this.countSubEntries(this.entry);

    let message = `Удалить запись "${entryName}"?`;
    if (subEntriesCount > 0) {
      message += `\nБудет также удалено ${subEntriesCount} вложенных записей.`;
    }

    if (confirm(message)) {
      this.entryDeleted.emit(this.entry.id);
    }
  }

  // Подсчет всех вложенных записей
  private countSubEntries(entry: Entry): number {
    let count = 0;
    for (const subEntry of entry.entries) {
      count += 1 + this.countSubEntries(subEntry);
    }
    return count;
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

  // Компактный отступ
  get marginLeft(): string {
    return (this.depth * 15) + 'px';
  }
}