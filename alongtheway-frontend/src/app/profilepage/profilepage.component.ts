import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

interface Car {
  mpg: number;
  tankCapacity: number;
}

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {
  user: User = {
    id: '',
    username: '',
    mpg: 0,
    tankCapacity: 0
  };

  updatedUser: User = {
    id: '',
    username: '',
    mpg: 0,
    tankCapacity: 0
  };

  isEditing = false;
  username = '';
  carList: Car[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUsername.subscribe((username: string) => {
      this.username = username;
    });
    this.authService.getUserId.subscribe((userId: string) => {
      this.getUserData(userId);
    });
  }
  

  getUserData(userId: string): void {
    this.authService.getUserId.subscribe((userId: string) => {
      this.userService.getUser(userId).subscribe({
        next: (user: User) => {
          this.user = user;
          this.updatedUser = { ...user }; // Make a copy of the user object for editing
        },
        error: (error: any) => {
          console.error('Error fetching user data:', error);
        }
      });
    });
  }
  
  
  

  saveUserCarInfo(): void {
    this.userService.updateUserCarInfo(this.user.id, this.updatedUser).subscribe(
      (user: User) => {
        this.user = user;
        console.log('User car information updated:', user);
        this.isEditing = false; // Exit editing mode
      },
      (error: any) => {
        console.error('Error updating user car information:', error);
      }
    );
  }

  editCar(): void {
    this.isEditing = true;
  }

  saveChanges(index: number): void {
    this.isEditing = false; // Exit editing mode
    // Update the car at the specified index in the carList
    this.carList[index] = { ...this.carList[index] };
  }
  

  cancelEdit(): void {
    this.isEditing = false; // Exit editing mode
  }
  

  removeCar(index: number): void {
    this.carList.splice(index, 1);
  }

  saveCar(car: Car): void {
    this.carList.push(car);
  }

  clearInputs(form: any): void {
    form.resetForm();
  }
}

