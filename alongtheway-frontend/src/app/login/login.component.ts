import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class loginComponent implements OnInit {

  loginData: { username: string, email: string, password: string } = {
    username: '',
    email: '',
    password: ''
  };
  constructor() { }

  ngOnInit(): void {
  }

  submitLoginForm(): void {
    console.log('submitted:', this.loginData.username, this.loginData.email, this.loginData.password);
  }
}