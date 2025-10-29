import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,    // Для HTTP запросов к бэкенду
    FormsModule          // Для работы с формами
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }