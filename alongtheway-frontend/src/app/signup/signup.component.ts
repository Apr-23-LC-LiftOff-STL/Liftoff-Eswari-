import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

interface SignupData {
  username: string;
  password: string;
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupData: SignupData = {
    username: '',
    password: ''
  };

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  submitSignupForm(): void {
    this.apiService.signup(this.signupData)
      .subscribe(
        response => {
          console.log('Sign-up successful:', response);
          // Add your logic to navigate to the homepage here
        },
        error => {
          console.error('Sign-up failed:', error);
        }
      );
    console.log('submitted:', this.signupData.username, this.signupData.password);
  }
}  