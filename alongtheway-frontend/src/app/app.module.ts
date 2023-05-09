import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './weather/weather.service';
import { WeatherComponent } from './weather/weather.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent],
})
export class AppModule { }