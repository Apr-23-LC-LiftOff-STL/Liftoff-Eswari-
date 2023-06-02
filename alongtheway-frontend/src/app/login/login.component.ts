import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class loginComponent implements OnInit {

  loginData: { username: string, password: string } = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  submitLoginForm(): void {
    this.http.post('http://localhost:4200/login', this.loginData).subscribe(
      (response) => {
        // Handle successful response
        console.log(response);

        // Redirect the user to /home
        this.router.navigate(['/home']);
      },
      (error) => {
        // Handle error response
        console.log(error);
      }
    );
  }
}