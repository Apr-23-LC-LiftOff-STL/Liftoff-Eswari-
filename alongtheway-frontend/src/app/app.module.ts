import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GasCalculatorComponent } from './gas-calculator/gas-calculator.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GasCalculatorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
