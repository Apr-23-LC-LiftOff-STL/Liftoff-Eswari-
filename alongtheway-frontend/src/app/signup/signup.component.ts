import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupData = {
    username: '',
    password: '',
    verifyPassword: '',
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  submitSignupForm(): void {
    //   const url = 'http://localhost:8080/signup';
    const payload = {
      username: this.signupData.username,
      password: this.signupData.password,
      verifyPassword: this.signupData.verifyPassword
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.apiService.signup(payload, headers)
      .subscribe(
        response => {
          console.log('Sign-up successful:', response);
          // Add your logic to navigate to the homepage here
        },
        error => {
          console.error('Sign-up failed:', error);
          if (error.error instanceof ErrorEvent) {
            // Client-side error occurred
            console.error('Client-side error:', error.error.message);
          } else {
            // Server-side error occurred
            console.error('Server-side error:', error.status, error.error);
          }
        }
      );


    console.log('submitted:', this.signupData.username, this.signupData.password, this.signupData.verifyPassword);
  }
}
