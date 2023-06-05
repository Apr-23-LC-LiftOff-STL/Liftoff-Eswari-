import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutusandfaqComponent } from './aboutusandfaq/aboutusandfaq.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';
import { SavedTripsComponent } from './saved-trips/saved-trips.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  // {path: '', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutusandfaqComponent},
  {path: 'profile', component: ProfilepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'saved-trips', component: SavedTripsComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
