// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';
// import { User, UserForUpdate } from './user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = 'http://localhost:8080/profile';

//   constructor(
//     private http: HttpClient,
//     private authService: AuthService
//   ) {}

//   getUser(userId: string): Observable<User | null> {
//     const url = `${this.apiUrl}/${userId}`;
//     const token = this.authService.getToken();

//     if (!token) {
//       throw new Error('No authentication token');
//     }

//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + token
//       })
//     };

//     return this.http.get<User>(url, httpOptions).pipe(
//       map((response: any) => {
//         return {
//           ...response,
//           mpg: parseInt(response.mpg.$numberInt),
//           tankCapacity: parseInt(response.tankCapacity.$numberInt)
//         };
//       }),
//       catchError(() => of(null))
//     );
//   }

//   updateUserCarInfo(userId: string, userData: UserForUpdate): Observable<User> {
//     const url = `${this.apiUrl}/${userId}/car`;
//     const token = this.authService.getToken();

//     if (!token) {
//       throw new Error('No authentication token');
//     }

//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + token
//       })
//     };

//     const userDataToSend = {
//       ...userData,
//       mpg: { $numberInt: userData.mpg.toString() },
//       tankCapacity: { $numberInt: userData.tankCapacity.toString() }
//     };

//     return this.http.put<User>(url, userDataToSend, httpOptions);
//   }
// }
