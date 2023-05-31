import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './weather/weather.service';
import { WeatherComponent } from './weather/weather.component';
import { HttpClientModule } from '@angular/common/http';
import { AboutusandfaqComponent } from './aboutusandfaq/aboutusandfaq.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { SignupComponent } from './signup/signup.component';
import { loginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    WeatherComponent,
    AboutusandfaqComponent,
    ProfilepageComponent,
    SignupComponent,
    loginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent],
})
export class AppModule { }