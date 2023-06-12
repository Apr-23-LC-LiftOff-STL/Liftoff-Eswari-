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
  private mpg$ = new BehaviorSubject<number>(0);
  private tankCapacity$ = new BehaviorSubject<number>(0);

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  get getUsername(): Observable<string> {
    return this.username$.asObservable();
  }

  get getMpg(): Observable<number> {
    return this.mpg$.asObservable();
  }

  get getTankCapacity(): Observable<number> {
    return this.tankCapacity$.asObservable();
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
        this.mpg$.next(token ? this.getMpgFromToken(token) : 0);
        this.tankCapacity$.next(token ? this.getTankCapacityFromToken(token) : 0);
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
    this.mpg$.next(token ? this.getMpgFromToken(token) : 0);
    this.tankCapacity$.next(token ? this.getTankCapacityFromToken(token) : 0);
  }

  private getUsernameFromToken(token: string): string {
    const decodedToken: any = jwt_decode(token);
    return decodedToken.username || '';
  }

  private getMpgFromToken(token: string): number {
    const decodedToken: any = jwt_decode(token);
    const mpg = decodedToken.mpg;
    console.log('MPG:', mpg);
    return decodedToken.mpg || 0;
  }

  private getTankCapacityFromToken(token: string): number {
    const decodedToken: any = jwt_decode(token);
    const tankCapacity = decodedToken.tankCapacity;
    console.log('Tank Capacity:', tankCapacity);
    return decodedToken.tankCapacity || 0;
  }

  
}
