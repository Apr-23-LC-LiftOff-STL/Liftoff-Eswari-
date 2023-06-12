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

  getToken(): string | null {
    const token = this.cookieService.get('token');
    return token ? `Bearer ${token}` : null;
  }

  login(username: string, password: string): Observable<any> {
    const url = 'http://localhost:8080/login';
    const loginData = {
      username: username,
      password: password
    };
    return this.http.post(url, loginData).pipe(
      tap((response: any) => {
        console.log(response); // Log server response
        const token = response.token as string;
        this.cookieService.set('token', token); // Set the token as a cookie
        this.isLoggedIn$.next(true);
        this.username$.next(this.getUsernameFromToken(token));
        this.userId$.next(this.getUserIdFromToken(token));
        this.router.navigate(['/home']);
        this.mpg$.next(response.mpg);
        this.tankCapacity$.next(response.tankCapacity);
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
        this.cookieService.set('token', token); // Set the token as a cookie
        this.isLoggedIn$.next(true);
        this.username$.next(this.getUsernameFromToken(token));
        this.mpg$.next(token ? this.getMpgFromToken(token) : 0);
        this.tankCapacity$.next(token ? this.getTankCapacityFromToken(token) : 0);
        this.router.navigate(['/home']);
        this.mpg$.next((response as any).mpg);
        this.tankCapacity$.next((response as any).tankCapacity);
      })
    );
  }

  logout(): Observable<any> {
    this.cookieService.delete('token'); // Remove the token cookie
    this.isLoggedIn$.next(false);
    this.username$.next('');
    this.userId$.next(null);
    this.router.navigate(['/login']); // Navigate to the login page
    return this.http.post<any>('/logout', {});
  }

  private initializeAuthState(): void {
    const token = this.cookieService.get('token'); // Retrieve the token from the cookie
    this.isLoggedIn$.next(!!token);
    this.username$.next(token ? this.getUsernameFromToken(token) : '');
    this.mpg$.next(token ? this.getMpgFromToken(token) : 0);
    this.tankCapacity$.next(token ? this.getTankCapacityFromToken(token) : 0);
  }

  private getUsernameFromToken(token: string | null): string {
    if (!token) {
      return '';
    }

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
