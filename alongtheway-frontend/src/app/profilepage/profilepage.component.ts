import { Component, OnInit } from '@angular/core';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

interface Car {
  year: number;
  make: string;
  model: string;
  mpg: number;
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    // Get the userId from the user object or from any other source
    const userId = this.user.id;
  
    // Make a request to fetch the user data
    this.userService.getUser(userId).subscribe(
      (user: User) => {
        this.user = user;
        // Make a copy of the user object for editing
        this.updatedUser = Object.assign({}, user);
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  

  saveUserCarInfo(): void {
    this.userService.updateUserCarInfo(this.user.id, this.updatedUser).subscribe(
      (user: User) => {
        this.user = user;
        console.log('User car information updated:', user);
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
    this.carList[index] = Object.assign({}, this.carList[index]);
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
