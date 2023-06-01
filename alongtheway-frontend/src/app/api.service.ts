import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  signup(signupData: { username: string, password: string }) {
    const url = 'http://localhost:8080/signup';
    return this.http.post(url, signupData);
  }

  login(username: string, password: string) {
    const url = '<localhost:8080/login>'; // Replace with your actual backend endpoint
    const data = { username, password };
    return this.http.post(url, data);
  }
}
