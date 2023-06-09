import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AboutusandfaqComponent } from './aboutusandfaq/aboutusandfaq.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
// import { ProfilepageComponent } from './profilepage/profilepage.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './user/user.component';
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './weather/weather.service';
import { TripideasComponent } from './tripideas/tripideas.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    WeatherComponent,
    AboutusandfaqComponent,
    // ProfilepageComponent,
    SignupComponent,
    LoginComponent,
    UserComponent,
    TripideasComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // Moved from declarations to imports
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent],
})
export class AppModule { }
