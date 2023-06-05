import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  signup(signupData: { username: string, password: string }, headers: HttpHeaders) {
    const url = 'http://localhost:8080/signup';
    return this.http.post(url, signupData, { headers });
  }

  login(username: string, password: string) {
    const url = 'http://localhost:8080/auth/login';
    const data = { username, password };
    return this.http.post(url, data);
  }
}
