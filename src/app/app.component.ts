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
        this.showSuccess(`Загружено ${this.countTotalEntries(this.entries)} записей`);
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
      next: (response: any) => {
        this.loading = false;
        this.showSuccess(`✅ ${response.message || 'Данные сохранены'}`);
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
  }

  // УЛУЧШЕННОЕ УДАЛЕНИЕ - локальное и на сервере
  removeEntry(entryId: string) {
    this.entries = this.todoService.removeEntry(this.entries, entryId);
    this.showSuccess('Запись удалена');
  }

  // Массовое удаление пустых записей
  removeEmpty() {
    const beforeCount = this.countTotalEntries(this.entries);
    this.entries = this.todoService.removeEmptyEntries(this.entries);
    const afterCount = this.countTotalEntries(this.entries);
    const removedCount = beforeCount - afterCount;

    if (removedCount > 0) {
      this.showSuccess(`Удалено ${removedCount} пустых записей`);
      // Сохраняем изменения на сервере
      this.saveEntries();
    } else {
      this.showSuccess('Пустые записи не найдены');
    }
  }

  // Очистка orphaned файлов на сервере
  cleanupOrphaned() {
    this.todoService.cleanupOrphaned().subscribe({
      next: (response: any) => {
        this.showSuccess(`✅ ${response.message || 'Orphaned файлы очищены'}`);
      },
      error: (err) => {
        this.error = 'Ошибка очистки orphaned файлов';
        console.error('Ошибка:', err);
      }
    });
  }

  // Подтверждение удаления всех записей
  confirmClearAll() {
    if (confirm('Вы уверены, что хотите удалить ВСЕ записи? Это действие нельзя отменить.')) {
      this.entries = [];
      this.showSuccess('Все записи удалены');
      // Сохраняем пустой список на сервере
      this.saveEntries();
    }
  }

  onEntriesChange() {
    // Автосохранение при изменении (опционально)
    // this.saveEntries();
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = null, 3000);
  }

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
      if (!entry.id) entry.id = this.generateId();
      if (entry.entries?.length > 0) {
        entry.entries = this.addMissingIds(entry.entries);
      }
      if (entry.isExpanded === undefined) entry.isExpanded = true;
      return entry;
    });
  }

  private generateId(): string {
    return 'entry_' + Math.random().toString(36).substr(2, 9);
  }
}