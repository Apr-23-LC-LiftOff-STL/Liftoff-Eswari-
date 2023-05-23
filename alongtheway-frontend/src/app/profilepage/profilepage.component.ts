import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


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
  
  carList: Car[] = [];
  editedCarIndex: number | null = null;
  editedCar: any = {};

  sortByColumn: keyof Car | undefined; // Variable to store the column name to sort
  sortDirection: number = 1; // Variable to store the sorting direction (1 for ascending, -1 for descending)
  
  constructor() { }

  ngOnInit(): void {
  }

  saveCar(formData: any): void {
    let newCar: Car = formData;
    this.carList.push(newCar);
  }

  editCar(index: number) {
    this.editedCar = { ...this.carList[index] };
    this.editedCarIndex = index;
  }

  saveEditedCar(editedCar: any) {
    this.carList[this.editedCarIndex as number] = editedCar;
    this.editedCarIndex = null;
    this.editedCar = {};
  }

  cancelEdit() {
    if (this.editedCarIndex !== null) {
      this.carList[this.editedCarIndex] = { ...this.editedCar };
      this.editedCarIndex = null;
      this.editedCar = {};
    }
  }
  removeCar(index: number): void {
    this.carList.splice(index, 1);
  }

  saveChanges(index: number) {
    this.editedCarIndex = null;
  }

  sortCarList(): void {
    this.carList.sort((a: Car, b: Car) => a.year - b.year);
  }

  showMyVehicles: boolean = true;

  clearInputs(carForm: NgForm) {
    carForm.resetForm();
  }

  // Method to handle sorting
  sortTable(columnName: keyof Car) {
    if (this.sortByColumn === columnName) {
      // If the same column is clicked again, reverse the sort direction
      this.sortDirection *= -1;
    } else {
      // If a different column is clicked, set the new column and default to ascending order
      this.sortByColumn = columnName;
      this.sortDirection = 1;
    }

 // Perform the sorting
 this.carList.sort((a, b) => {
  if (a[columnName] < b[columnName]) {
    return -1 * this.sortDirection;
  } else if (a[columnName] > b[columnName]) {
    return 1 * this.sortDirection;
  } else {
    return 0;
  }
});
}
}
