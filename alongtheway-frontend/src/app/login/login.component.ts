import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginData: { username: string, password: string } = {
    username: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitLoginForm(): void {
    const { username, password } = this.loginForm.value;
  
    this.authService.login(username, password).subscribe(
      response => {
        // Handle the successful login response
        console.log('Login successful:', response);
        this.router.navigate(['/home']);
      },
      error => {
        // Handle the login error
        console.error('Login failed:', error);
        console.log('Error body:', error.error); // Log the response body for further investigation
      }
    );
  }
  
  
}
