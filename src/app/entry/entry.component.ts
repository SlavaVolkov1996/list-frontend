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
  @Input() maxDepth: number = 10; // Максимальная глубина для UI ограничений
  @Output() entryChanged = new EventEmitter<void>();
  @Output() entryDeleted = new EventEmitter<string>();

  // Добавить подзапись
  addSubEntry(): void {
    if (this.depth < this.maxDepth) {
      this.entry.entries.push(createEmptyEntry('Новая подзапись'));
      this.entry.isExpanded = true; // Автоматически раскрываем при добавлении
      this.entryChanged.emit();
    }
  }

  // Удалить эту запись
  deleteEntry(): void {
    this.entryDeleted.emit(this.entry.id);
  }

  // Удалить подзапись
  onSubEntryDeleted(subEntryId: string): void {
    this.entry.entries = this.entry.entries.filter(e => e.id !== subEntryId);
    this.entryChanged.emit();
  }

  // Переключить раскрытие/сворачивание
  toggleExpand(): void {
    this.entry.isExpanded = !this.entry.isExpanded;
  }

  // Обработчик изменения подзаписи
  onSubEntryChanged(): void {
    this.entryChanged.emit();
  }

  // Можно ли добавить еще подзаписи (ограничение по глубине)
  get canAddSubEntry(): boolean {
    return this.depth < this.maxDepth;
  }

  // CSS класс для отступа в зависимости от глубины
  get depthClass(): string {
    return `depth-${this.depth}`;
  }
}