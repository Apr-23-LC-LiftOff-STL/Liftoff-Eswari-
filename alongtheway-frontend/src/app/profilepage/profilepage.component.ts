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

  editedCarIndex: number | null = null;
  carList: Car[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        this.router.navigate(['/profile']); // Navigate to the profile page
      },
      (error: any) => {
        console.error('Error updating user car information:', error);
      }
    );
  }

  editCar(index: number): void {
    this.editedCarIndex = index;
  }

  saveChanges(index: number): void {
    this.editedCarIndex = null;
    // Update the car at the specified index in the carList
    this.carList[index] = { ...this.carList[index] };
  }

  cancelEdit() {
    if (this.editedCarIndex !== null) {
      this.carList[this.editedCarIndex] = { ...this.editedCar };
      this.editedCarIndex = null;
      this.editedCar = { mpg: 0, tankCapacity: 0 };
    }
  }

  removeCar(index: number): void {
    this.carList.splice(index, 1);
  }

  cancelEdit(): void {
    this.editedCarIndex = null;
  }

  saveCar(car: Car): void {
    this.carList.push(car);
  }

  clearInputs(form: any): void {
    form.resetForm();
  }
}

