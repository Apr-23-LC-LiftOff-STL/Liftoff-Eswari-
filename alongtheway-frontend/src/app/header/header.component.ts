import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username$: Observable<string> | undefined;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.username$ = this.authService.getUsername;
  }

  logout(): void {
    this.authService.logout().subscribe(
      (      response: any) => {
        console.log('Logout successful:', response);
        // Additional logout success logic here
      },
      (      error: any) => {
        console.error('Logout failed:', error);
        // Additional logout error handling here
      }
    );
  }
}
