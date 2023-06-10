import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
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

  getUser(userId: string, httpOptions: any): Observable<User | null> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<User>(url, httpOptions).pipe(
      map((response: any) => response as User),
      catchError(() => of(null))
    );
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
