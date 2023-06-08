import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
