import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EntryComponent } from './entry/entry.component'; // Добавляем новый компонент

@NgModule({
  declarations: [
    AppComponent,
    EntryComponent  // Регистрируем рекурсивный компонент
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }