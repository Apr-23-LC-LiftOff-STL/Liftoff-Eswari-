import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private username$ = new BehaviorSubject<string>('');

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  get getUsername(): Observable<string> {
    return this.username$.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  login(username: string, password: string): Observable<any> {
    const url = 'http://localhost:8080/login';
    const loginData = {
      username: username,
      password: password
    };
    return this.http.post(url, loginData).pipe(
      tap(response => {
        const token = (response as any).token as string;
        localStorage.setItem('token', token);
        this.isLoggedIn$.next(true);
        this.username$.next(this.getUsernameFromToken(token));
        this.router.navigate(['/home']);
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    this.isLoggedIn$.next(false);
    this.username$.next('');
    return this.http.post<any>('/auth/logout', {});
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn$.next(!!token);
    this.username$.next(token ? this.getUsernameFromToken(token) : '');
  }

  private getUsernameFromToken(token: string): string {
    // Implement your logic to extract the username from the token
    // and return it here
    return '';
  }
}