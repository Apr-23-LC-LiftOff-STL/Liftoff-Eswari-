import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData: {
    username: string,
    password: string,
    verifyPassword: string,
    mpg: number,
    tankCapacity: number
  } = {
    username: '',
    password: '',
    verifyPassword: '',
    mpg: 0,
    tankCapacity: 0
  };

  constructor(private apiService: ApiService, private router: Router) { }
  
  submitSignupForm(signupForm: NgForm) {
    if (signupForm.invalid) {
      return;
    }

    const payload = {
      username: this.signupData.username,
      password: this.signupData.password,
      verifyPassword: this.signupData.verifyPassword,
      mpg: this.signupData.mpg || 0, // Use a default value if null
      tankCapacity: this.signupData.tankCapacity || 0 // Use a default value if null
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.apiService.signup(payload, headers).subscribe(
      (response) => {
        console.log('Sign-up successful:', response);
        this.router.navigate(['/home']); // Replace '/main' with the desired route for the main page
      },
      (error) => {
        console.log('Sign-up failed:', error);
      }
    );
    
  }
}
