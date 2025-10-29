import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Entry, createEmptyEntry } from './models/entry';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEntries(): Observable<Entry[]> {
    console.log('Запрос данных с бэкенда...');
    return this.http.get<Entry[]>(`${this.baseUrl}/api/entries/`).pipe(
      tap(entries => console.log('Получены данные:', entries))
    );
  }

  saveEntries(entries: Entry[]): Observable<any> {
    console.log('Сохранение данных на бэкенд...', entries);
    return this.http.post(`${this.baseUrl}/api/save_entries/`, entries).pipe(
      tap(() => console.log('Данные успешно сохранены'))
    );
  }

  // ИСПРАВЛЕННЫЙ МЕТОД - используем createEmptyEntry
  addNewEntry(entries: Entry[]): Entry[] {
    const newEntry = createEmptyEntry('Новая запись');
    return [...entries, newEntry];
  }

  removeEntry(entries: Entry[], index: number): Entry[] {
    return entries.filter((_, i) => i !== index);
  }

  findEntryByTitle(entries: Entry[], title: string): Entry | null {
    for (const entry of entries) {
      if (entry.title === title) {
        return entry;
      }
      if (entry.entries.length > 0) {
        const found = this.findEntryByTitle(entry.entries, title);
        if (found) return found;
      }
    }
    return null;
  }

  countTotalEntries(entries: Entry[]): number {
    let count = 0;
    for (const entry of entries) {
      count += 1 + this.countTotalEntries(entry.entries);
    }
    return count;
  }
}