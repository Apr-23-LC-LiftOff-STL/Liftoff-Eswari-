import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User, UserForUpdate } from '../user/user.model';
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
    _id: '',
    username: '',
    mpg: { $numberInt: '0' },
    tankCapacity: { $numberInt: '0' }
  };

  updatedUser: UserForUpdate = {
    _id: '',
    username: '',
    mpg: 0,
    tankCapacity: 0
  };

  isLoggedIn: boolean = false;
  userId: string = '';
  username: string = '';
  isEditing: boolean = false;
  editUserForm!: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.getUsername.subscribe((username: string) => {
      this.username = username;
    });

    this.authService.getUserId.subscribe((userId: string | null) => {
      if (userId) {
        this.userService.getUser(userId).subscribe((user: User | null) => {
          if (user) {
            this.user = {
              ...user,
              mpg: { $numberInt: String(user.mpg) },
              tankCapacity: { $numberInt: String(user.tankCapacity) },
            };

            this.editUserForm = this.fb.group({
              mpg: [Number(user.mpg.$numberInt), Validators.required],
              tankCapacity: [Number(user.tankCapacity.$numberInt), Validators.required],
            });
          }
        });
      }
    });
  }

  getUserData(userId: string): void {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No authentication token');
      return;
    }

    this.userService.getUser(userId).subscribe(
      (user: User | null) => {
        if (user) {
          this.user = user;
          this.updatedUser = {
            _id: user._id,
            username: user.username,
            mpg: Number(user.mpg.$numberInt),
            tankCapacity: Number(user.tankCapacity.$numberInt)
          };
        } else {
          console.error('Error fetching user data');
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  saveUserCarInfo(): void {
    this.userService.updateUserCarInfo(this.user._id, this.updatedUser).subscribe(
      (user: User) => {
        this.user = user;
        this.updatedUser = {
          _id: user._id,
          username: user.username,
          mpg: Number(user.mpg.$numberInt),
          tankCapacity: Number(user.tankCapacity.$numberInt)
        };
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

  cancelEdit(): void {
    this.isEditing = false; // Exit editing mode
  }
}
