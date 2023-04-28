import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-gas-calculator',
  templateUrl: './gas-calculator.component.html',
  styleUrls: ['./gas-calculator.component.css']
})
export class GasCalculatorComponent implements OnInit {
  directionsService: any;
  startInput: any;
  endInput: any;
  fuelCapacityInput: any;
  mpg: any;
  tankCapacity: any;

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
  }

  ngOnInit(): void {
    this.startInput = document.getElementById('startLocation');
    this.endInput = document.getElementById('endLocation');
    this.fuelCapacityInput = document.getElementById('fuelCapacity');

    const startAutocomplete = new google.maps.places.Autocomplete(this.startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(this.endInput);

    this.mpg = document.getElementById('mpg').value;
    this.tankCapacity = document.getElementById('tankCapacity').value;

    document.getElementById('mpg').addEventListener('change', () => {
      this.mpg = document.getElementById('mpg').value;
      this.updateFuelCapacity();
    });

    document.getElementById('tankCapacity').addEventListener('change', () => {
      this.tankCapacity = document.getElementById('tankCapacity').value;
      this.updateFuelCapacity();
    });
  }

  updateFuelCapacity() {
    const fuelCapacity = this.mpg * this.tankCapacity;
    this.fuelCapacityInput.value = fuelCapacity.toFixed(2);
  }

  calculateFuelAndDistance() {
    const startLocation = document.getElementById('startLocation').value;
    const endLocation = document.getElementById('endLocation').value;
    this.mpg = document.getElementById('mpg').value;
    this.tankCapacity = document.getElementById('tankCapacity').value;
    this.fuelCapacityInput = document.getElementById('fuelCapacity');
    const distanceInput = document.getElementById('distance');
    const stopsRequiredOutput = document.getElementById('stopsRequired');

    if (startLocation !== '' && endLocation !== '' && this.mpg !== '' && this.tankCapacity !== '') {
      this.directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const distance = response.routes[0].legs[0].distance.value / 1609.34;
            distanceInput.value = distance.toFixed(2);
            const fuelCapacity = parseFloat(this.mpg) * parseFloat(this.tankCapacity);
            this.fuelCapacityInput.value = fuelCapacity.toFixed(2);

            const stopsRequired = Math.ceil(distance / fuelCapacity);
            stopsRequiredOutput.innerHTML = `You will need to make ${stopsRequired} stop(s) for gas.`;
          } else {
            distanceInput.value = '';
            this.fuelCapacityInput.value = '';
            stopsRequiredOutput.innerHTML = '';
            alert(`Directions request failed due to ${status}`);
          }
        }
      );
    } else {
      distanceInput.value = '';
      this.fuelCapacityInput.value = '';
      stopsRequiredOutput.innerHTML = '';
    }
  }

  onInputChange() {
    this.calculateFuelAndDistance();
  }
}
