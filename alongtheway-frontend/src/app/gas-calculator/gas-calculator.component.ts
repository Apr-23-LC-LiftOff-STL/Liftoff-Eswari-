import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-gas-calculator',
  templateUrl: './gas-calculator.component.html',
  styleUrls: ['./gas-calculator.component.css']
})
export class GasCalculatorComponent implements OnInit {
  startLocation: string = '';
  endLocation: string = '';
  fuelCapacity: string = '';
  distance: string = '';
  mpg: number = 0;
  tankCapacity: number = 0;

  constructor() { }

  ngOnInit() {
    const inputStart = document.getElementById('startLocation') as HTMLInputElement;
    const inputEnd = document.getElementById('endLocation') as HTMLInputElement;
    const options = {
      types: ['geocode'],
      componentRestrictions: {country: 'us'}
    };

    if (typeof google !== 'undefined') {
      const autocompleteStart = new google.maps.places.Autocomplete(inputStart, options);
      const autocompleteEnd = new google.maps.places.Autocomplete(inputEnd, options);
    }
  }

  updateFuelCapacity() {
    const fuelCapacity = this.mpg * this.tankCapacity;
    this.fuelCapacity = fuelCapacity.toFixed(2);
  }

  calculateFuelAndDistance() {
    if (this.startLocation && this.endLocation && this.mpg && this.tankCapacity) {
      const directionsService = new google.maps.DirectionsService();
      const startLocation = this.startLocation;
      const endLocation = this.endLocation;
      const mpg = this.mpg;
      const tankCapacity = this.tankCapacity;
      const fuelCapacityInput = document.getElementById('fuelCapacity') as HTMLInputElement;
      const distanceInput = document.getElementById('distance') as HTMLInputElement;
      const stopsRequiredOutput = document.getElementById('stopsRequired');

      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const distance = response.routes[0].legs[0].distance.value / 1609.34;
            if (distanceInput) {
              this.distance = distance.toFixed(2);
            }

            const fuelCapacity = parseFloat(String(mpg)) * parseFloat(String(tankCapacity));
            fuelCapacityInput.value = fuelCapacity.toFixed(2);

            const stopsRequired = Math.ceil(distance / fuelCapacity);
            if (stopsRequiredOutput) {
              stopsRequiredOutput.innerHTML = `You will need to make ${stopsRequired} stop(s) for gas.`;
            }

          } else {
            if (fuelCapacityInput) {
              fuelCapacityInput.value = '';
            }
            if (stopsRequiredOutput) {
              stopsRequiredOutput.innerHTML = '';
            }
            alert(`Directions request failed due to ${status}`);
          }
        }
      );
    } else {
      const fuelCapacityInput = document.getElementById('fuelCapacity') as HTMLInputElement;
      const stopsRequiredOutput = document.getElementById('stopsRequired');
      if (fuelCapacityInput) {
        fuelCapacityInput.value = '';
      }
      if (stopsRequiredOutput) {
        stopsRequiredOutput.innerHTML = '';
      }
    }
  }

  onInputChange() {
    this.calculateFuelAndDistance();
  }
}
