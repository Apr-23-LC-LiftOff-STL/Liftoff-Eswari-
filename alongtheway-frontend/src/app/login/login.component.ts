import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: { username: string, password: string } = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
  }

  submitLoginForm(): void {
    const { username, password } = this.loginData;
    this.authService.login(username, password).subscribe(
      response => {
        // Handle the successful login response
        console.log('Login successful:', response);
        this.router.navigate(['/home']); // Replace '/home' with the desired route path

      },
      error => {
        // Handle the login error
        console.error('Login failed:', error);
      }
    );
  }
}
