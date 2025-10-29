import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entry } from './models/entry';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Получить все записи с бэкенда
  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/api/entries/`);
  }

  // Сохранить записи на бэкенд
  saveEntries(entries: Entry[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/save_entries/`, entries);
  }

  // Добавить новую запись (локально, без сохранения на сервер)
  addNewEntry(entries: Entry[]): Entry[] {
    const newEntry: Entry = {
      title: 'Новая запись',
      entries: []
    };
    return [...entries, newEntry];
  }

  // Удалить запись по индексу (локально)
  removeEntry(entries: Entry[], index: number): Entry[] {
    return entries.filter((_, i) => i !== index);
  }
}