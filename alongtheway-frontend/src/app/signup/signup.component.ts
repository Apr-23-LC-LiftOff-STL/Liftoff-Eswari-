import { Component, NgModule, OnInit } from '@angular/core';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  signupData: { username: string, password: string } = {
    username: '',
    password: ''
  };
  constructor(private ApiService: ApiService) { }

  ngOnInit(): void {
  }

  submitSignupForm(): void {
    this.ApiService.signup(this.signupData.username, this.signupData.password)
      .subscribe(
        response => {
          console.log('Sign-up successful:', response);
        },
        error => {
          console.error('Sign-up failed:', error);
        }
      )
    console.log('submitted:', this.signupData.username, this.signupData.password);
  }
}
