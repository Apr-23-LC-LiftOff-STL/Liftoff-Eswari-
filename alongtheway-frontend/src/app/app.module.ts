import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfilepageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    ProfilepageComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
