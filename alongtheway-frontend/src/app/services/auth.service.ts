import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private username$ = new BehaviorSubject<string>('');
  private userId$ = new BehaviorSubject<string>('');

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  get getUsername(): Observable<string> {
    return this.username$.asObservable();
  }

  get getUserId(): Observable<string> {
    return this.userId$.asObservable();
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
      tap((response: any) => {
        const token = response.token as string;
        localStorage.setItem('token', token); // Store the token in local storage
        this.isLoggedIn$.next(true);
        this.username$.next(this.getUsernameFromToken(token));
        this.userId$.next(this.getUserIdFromToken(token));
        this.router.navigate(['/home']);
      })
    );
  }

  signup(username: string, password: string): Observable<any> {
    const url = 'http://localhost:8080/signup';
    const signupData = {
      username: username,
      password: password
    };
    return this.http.post(url, signupData).pipe(
      tap(response => {
        const token = (response as any).token as string;
        localStorage.setItem('token', token);
        this.isLoggedIn$.next(true);
        this.username$.next(this.getUsernameFromToken(token));
        this.userId$.next(this.getUserIdFromToken(token));
        this.userId$.next(this.getUserIdFromToken(token));
        this.router.navigate(['/home']);
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    this.isLoggedIn$.next(false);
    this.username$.next('');
    this.userId$.next('');
    this.router.navigate(['/login']); // Navigate to the login page
    return this.http.post<any>('/logout', {});
  }
  

  private initializeAuthState(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    this.isLoggedIn$.next(!!token);
    this.username$.next(token ? this.getUsernameFromToken(token) : '');
    this.userId$.next(token ? this.getUserIdFromToken(token) : '');
    this.userId$.next(token ? this.getUserIdFromToken(token) : '');
  }
  
  private getUsernameFromToken(token: string): string {
    const decodedToken: any = jwt_decode(token);
    return decodedToken.username || '';
  }

  private getUserIdFromToken(token: string): string {
    const decodedToken: any = jwt_decode(token);
    return decodedToken.userId || '';
  }

}