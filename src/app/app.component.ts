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
  maxDepth = 10; // Максимальная глубина вложенности

  constructor(private todoService: TodoListService) {}

  ngOnInit() {
    this.loadEntries();
  }

  // Загрузка записей с сервера
  loadEntries() {
    this.loading = true;
    this.error = null;

    this.todoService.getEntries().subscribe({
      next: (data) => {
        // Добавляем ID к существующим записям если их нет
        this.entries = this.addMissingIds(data);
        this.loading = false;
        const totalEntries = this.countTotalEntries(this.entries);
        const currentDepth = getMaxDepth(this.entries);
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

  // Сохранение записей на сервер
  saveEntries() {
    this.loading = true;
    this.error = null;

    this.todoService.saveEntries(this.entries).subscribe({
      next: () => {
        this.loading = false;
        const totalEntries = this.countTotalEntries(this.entries);
        const currentDepth = getMaxDepth(this.entries);
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

  // Добавление новой корневой записи
  addEntry() {
    this.entries.push(createEmptyEntry());
    this.onEntriesChange();
  }

  // Удаление корневой записи
  removeEntry(entryId: string) {
    this.entries = this.entries.filter(entry => entry.id !== entryId);
    this.onEntriesChange();
  }

  // Обработчик изменения в записях
  onEntriesChange() {
    const totalEntries = this.countTotalEntries(this.entries);
    const currentDepth = getMaxDepth(this.entries);

    // Предупреждение о близости к максимальной глубине
    if (currentDepth >= this.maxDepth - 2) {
      this.successMessage = `⚠️ Текущая глубина: ${currentDepth}. Максимальная: ${this.maxDepth}`;
      setTimeout(() => {
        if (this.successMessage?.includes('⚠️')) {
          this.successMessage = null;
        }
      }, 3000);
    }
  }

  // Рекурсивный подсчет всех записей
  countTotalEntries(entries: Entry[]): number {
    let count = 0;
    for (const entry of entries) {
      count += 1 + this.countTotalEntries(entry.entries);
    }
    return count;
  }

  // Добавление ID к записям которые были загружены без ID
  private addMissingIds(entries: Entry[]): Entry[] {
    return entries.map(entry => {
      if (!entry.id) {
        entry.id = generateId();
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

  // Экспорт структуры (для отладки)
  exportStructure() {
    console.log('Структура записей:', JSON.stringify(this.entries, null, 2));
    this.successMessage = 'Структура экспортирована в консоль';
    setTimeout(() => this.successMessage = null, 3000);
  }

  // Сброс к примеру структуры
  loadSampleData() {
    this.entries = [
      {
        id: '1',
        title: 'Главный проект',
        entries: [
          {
            id: '2',
            title: 'Фаза 1',
            entries: [
              {
                id: '3',
                title: 'Исследование',
                entries: [
                  {
                    id: '4',
                    title: 'Анализ требований',
                    entries: []
                  },
                  {
                    id: '5',
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
}

// Вспомогательная функция для генерации ID
function generateId(): string {
  return 'entry_' + Math.random().toString(36).substr(2, 9);
}