import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUser, User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';


  constructor(private http: HttpClient) {}

  getUser(userId: string): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<User>(url);
  }

  updateUserCarInfo(userId: string, userData: UpdateUser): Observable<User> {
    const url = `${this.apiUrl}/${userId}/car`;
    return this.http.put<User>(url, userData);
  }
}
