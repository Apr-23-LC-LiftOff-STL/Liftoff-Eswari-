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
  
  constructor() { }

  ngOnInit(): void {
  }

  saveCar(formData: any): void {
    let newCar: Car = formData;
    this.carList.push(newCar);
  }

  editCar(index: number) {
    this.editedCarIndex = index;
  }

  saveEditedCar(editedCar: any) {
    this.carList[this.editedCarIndex as number] = editedCar;
    this.editedCarIndex = null;
    this.editedCar = {};
  }

  cancelEdit() {
    this.editedCarIndex = null;
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
}
