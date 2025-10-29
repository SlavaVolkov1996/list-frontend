import { Component, OnInit } from '@angular/core';
import { Entry, createEmptyEntry } from './models/entry';
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
        this.successMessage = `Загружено ${totalEntries} записей`;

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
        this.successMessage = `✅ Сохранено ${totalEntries} записей`;
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
    // Убрали проверки на глубину
  }

  // УПРОЩЕННЫЙ МЕТОД - без ограничений глубины
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
    // Пример с глубокой вложенностью
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
                    entries: [
                      {
                        id: this.generateId(),
                        title: 'Сбор информации',
                        entries: [
                          {
                            id: this.generateId(),
                            title: 'Интервью с заказчиком',
                            entries: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        isExpanded: true
      }
    ];
    this.successMessage = 'Загружен пример глубокой структуры';
    setTimeout(() => this.successMessage = null, 3000);
  }

  private generateId(): string {
    return 'entry_' + Math.random().toString(36).substr(2, 9);
  }
}