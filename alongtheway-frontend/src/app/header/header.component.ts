import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string | null = null;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUsername.subscribe(username => {
      this.username = username;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
