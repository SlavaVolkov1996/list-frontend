import { Component, OnInit } from '@angular/core';
import { Entry, createEmptyEntry, getMaxDepth, removeEntryById } from './models/entry';
import { TodoListService } from './todo-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  entries: Entry[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  maxDepth = 10;

  constructor(private todoService: TodoListService) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.loading = true;
    this.error = null;

    this.todoService.getEntries().subscribe({
      next: (data) => {
        this.entries = this.addMissingIds(data);
        this.loading = false;
        const totalEntries = this.countTotalEntries(this.entries);
        const currentDepth = this.getMaxDepth(this.entries);
        this.successMessage = `Загружено ${totalEntries} записей (глубина: ${currentDepth})`;

        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки данных с сервера';
        this.loading = false;
        console.error('Ошибка:', err);
      }
    });
  }

  saveEntries() {
    this.loading = true;
    this.error = null;

    this.todoService.saveEntries(this.entries).subscribe({
      next: () => {
        this.loading = false;
        const totalEntries = this.countTotalEntries(this.entries);
        const currentDepth = this.getMaxDepth(this.entries);
        this.successMessage = `✅ Сохранено ${totalEntries} записей (глубина: ${currentDepth})`;
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.error = 'Ошибка сохранения данных';
        this.loading = false;
        console.error('Ошибка:', err);
      }
    });
  }

  addEntry() {
    this.entries.push(createEmptyEntry());
    this.onEntriesChange();
  }

  removeEntry(entryId: string) {
    this.entries = this.entries.filter(entry => entry.id !== entryId);
    this.onEntriesChange();
  }

  onEntriesChange() {
    const totalEntries = this.countTotalEntries(this.entries);
    const currentDepth = this.getMaxDepth(this.entries);

    if (currentDepth >= this.maxDepth - 2) {
      this.successMessage = `⚠️ Текущая глубина: ${currentDepth}. Максимальная: ${this.maxDepth}`;
      setTimeout(() => {
        if (this.successMessage?.includes('⚠️')) {
          this.successMessage = null;
        }
      }, 3000);
    }
  }

  // ДОБАВЛЕННЫЙ МЕТОД - был отсутствует
  getMaxDepth(entries: Entry[]): number {
    if (entries.length === 0) return 0;

    let maxDepth = 0;
    for (const entry of entries) {
      const depth = 1 + this.getMaxDepth(entry.entries);
      if (depth > maxDepth) maxDepth = depth;
    }
    return maxDepth;
  }

  countTotalEntries(entries: Entry[]): number {
    let count = 0;
    for (const entry of entries) {
      count += 1 + this.countTotalEntries(entry.entries);
    }
    return count;
  }

  private addMissingIds(entries: Entry[]): Entry[] {
    return entries.map(entry => {
      if (!entry.id) {
        entry.id = this.generateId();
      }
      if (entry.entries && entry.entries.length > 0) {
        entry.entries = this.addMissingIds(entry.entries);
      }
      if (entry.isExpanded === undefined) {
        entry.isExpanded = true;
      }
      return entry;
    });
  }

  exportStructure() {
    console.log('Структура записей:', JSON.stringify(this.entries, null, 2));
    this.successMessage = 'Структура экспортирована в консоль';
    setTimeout(() => this.successMessage = null, 3000);
  }

  loadSampleData() {
    this.entries = [
      {
        id: this.generateId(),
        title: 'Главный проект',
        entries: [
          {
            id: this.generateId(),
            title: 'Фаза 1',
            entries: [
              {
                id: this.generateId(),
                title: 'Исследование',
                entries: [
                  {
                    id: this.generateId(),
                    title: 'Анализ требований',
                    entries: []
                  },
                  {
                    id: this.generateId(),
                    title: 'Прототипирование',
                    entries: []
                  }
                ]
              }
            ]
          }
        ],
        isExpanded: true
      }
    ];
    this.successMessage = 'Загружен пример структуры';
    setTimeout(() => this.successMessage = null, 3000);
  }

  // Вспомогательная функция для генерации ID
  private generateId(): string {
    return 'entry_' + Math.random().toString(36).substr(2, 9);
  }
}