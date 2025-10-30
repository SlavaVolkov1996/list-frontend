import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Entry, createEmptyEntry, removeEntryById } from './models/entry';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}/api/entries/`);
  }

  saveEntries(entries: Entry[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/save_entries/`, entries);
  }

  // НОВЫЙ МЕТОД: Удаление отдельной записи на сервере
  deleteEntry(entryId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/delete_entry/${entryId}`);
  }

  // НОВЫЙ МЕТОД: Очистка orphaned файлов
  cleanupOrphaned(): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/cleanup_orphaned/`, {});
  }

  // Улучшенное удаление записи (локальное + серверное)
  removeEntry(entries: Entry[], entryId: string): Entry[] {
    const result = removeEntryById(entries, entryId);

    // Также удаляем на сервере
    this.deleteEntry(entryId).subscribe({
      next: () => console.log(`Запись ${entryId} удалена на сервере`),
      error: (err) => console.error('Ошибка удаления на сервере:', err)
    });

    return result.updatedEntries;
  }

  // Удаление всех пустых записей
  removeEmptyEntries(entries: Entry[]): Entry[] {
    return entries
      .filter(entry => entry.title.trim() !== '')
      .map(entry => ({
        ...entry,
        entries: this.removeEmptyEntries(entry.entries)
      }));
  }
}