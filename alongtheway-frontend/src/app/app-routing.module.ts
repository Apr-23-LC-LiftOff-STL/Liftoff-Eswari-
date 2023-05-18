import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutusandfaqComponent } from './aboutusandfaq/aboutusandfaq.component';
import { ProfilepageComponent } from './profilepage/profilepage.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about', component: AboutusandfaqComponent},
  {path: 'profile', component: ProfilepageComponent}
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
