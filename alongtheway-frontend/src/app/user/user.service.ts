import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UpdateUser, User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/profile';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUser(userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    const token = this.authService.getToken();
  
    if (!token) {
      throw new Error('No authentication token');
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
  
    return this.http.get<User>(url, httpOptions);
  }
  

  updateUserCarInfo(userId: string, userData: UpdateUser): Observable<User> {
    const url = `${this.apiUrl}/${userId}/car`;
    const token = this.authService.getToken();
  
    if (!token) {
      throw new Error('No authentication token');
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    
    return this.http.put<User>(url, userData, httpOptions);
  }
  
}
