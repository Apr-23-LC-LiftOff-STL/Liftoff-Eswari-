import { Component, OnInit } from '@angular/core';


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
  constructor() { }

  ngOnInit(): void {
  }

  submitLoginForm(): void {
    console.log('submitted:', this.loginData.username, this.loginData.password);
  }
}