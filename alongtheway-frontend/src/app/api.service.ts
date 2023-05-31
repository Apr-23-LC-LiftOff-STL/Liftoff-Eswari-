import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  signup(username: string, password: string) {
    const url = 'localhost:8080/signup';
    const data = { username, password };
    return this.http.post(url, data);
  }
  login(username: string, password: string) {
    const url = '<localhost:8080/login>'; // Replace with your actual backend endpoint
    const data = { username, password };
    return this.http.post(url, data);
  }
}


