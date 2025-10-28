import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Entry} from './todo-list/todo-list.component'
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  constructor(private http: HttpClient) { }

  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(environment.getEntriesUrl);
  }

  saveEntries(entries: Entry[]): Observable<any> {
    return this.http.post<any>(environment.updateEntriesUrl, entries);
  }

}
