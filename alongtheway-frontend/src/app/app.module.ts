import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutusandfaqComponent } from './aboutusandfaq/aboutusandfaq.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutusandfaqComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
