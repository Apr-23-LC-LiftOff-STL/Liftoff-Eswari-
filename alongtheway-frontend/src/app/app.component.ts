import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) { }

  getWeather(point : string, lat?: number, lng?: number, time?: number): void {
    if (!lat || !lng) {
      return;
    }

    const apiKey = '8cab3c364814f611340d4aa2e6d26d6c';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`;


    this.http.get(weatherUrl).subscribe((weather: any) => {
      this.http.get(forecastUrl).subscribe((forecast: any) => {
        if (weather && forecast) {
          let weatherIcon = weather.weather[0].icon;
          let weatherTemp = weather.main.temp;

          if (time) {
            for (let f of forecast.list) {
              if (f.dt < time) continue;

              weatherIcon = f.weather[0].icon;
              weatherTemp = f.main.temp;
              break;
            }
          }

          let iconElement = document.getElementById(`${point}-weather-icon`) as HTMLElement;
          iconElement.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");

          let tempElement = document.getElementById(`${point}-weather-temp`) as HTMLElement;
          tempElement.textContent = Math.round(weatherTemp) + "°F";
        }
      });
    });
  }

  title = 'alongtheway-frontend';
  startLocation: string = "";
  endLocation: string = "";
  averageMPG: number = 0;
  tankCapacity: number = 0;
  map: google.maps.Map | null = null;
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;

  ngOnInit(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyC7TfA2reVISM_h9MIhhaoUH6FXsopH8ZA',
      libraries: ['places']
    });

    loader.load().then(() => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: { lat: 51.233334, lng: 6.78333 },
          zoom: 6
        });
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
          map: this.map
        });
        this.initAutocomplete();
      } else {
        console.error("Could not find map element");
      }
    });
  }

  initAutocomplete(): void {
    const startInput = document.getElementById("start-input") as HTMLInputElement;
    const endInput = document.getElementById("end-input") as HTMLInputElement;
    const mpgInput = document.getElementById("mpg-input") as HTMLInputElement;
    const tankInput = document.getElementById("tank-input") as HTMLInputElement;

    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);

    startAutocomplete.addListener("place_changed", () => {
      const place = startAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        this.map?.setCenter(place.geometry.location);
        this.map?.setZoom(14);
        this.startLocation = place.formatted_address ?? "";
        console.log("Start location:", this.startLocation);

        this.getWeather("start", place.geometry.location.lat(), place.geometry.location.lng());
      }
    });

    endAutocomplete.addListener("place_changed", () => {
      const place = endAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        this.map?.setCenter(place.geometry.location);
        this.map?.setZoom(14);
        this.endLocation = place.formatted_address ?? "";
        console.log("End location:", this.endLocation);

        this.getWeather("end", place.geometry.location.lat(), place.geometry.location.lng());
      }
    });

    mpgInput.addEventListener("change", () => {
      this.averageMPG = Number(mpgInput.value);
      console.log("Average MPG:", this.averageMPG);
    });

    tankInput.addEventListener("change", () => {
      this.tankCapacity = Number(tankInput.value);
      console.log("Tank Capacity:", this.tankCapacity);
    });
  }

  submitForm(): void {
    this.calculateRoute();
  }


  calculateRoute(): void {
    this.averageMPG = +this.averageMPG;
    this.tankCapacity = +this.tankCapacity;


    console.log("Calculating route...");
    console.log("Start location:", this.startLocation);
    console.log("End location:", this.endLocation);
    console.log("Average MPG:", this.averageMPG);
    console.log("Tank Capacity:", this.tankCapacity);

    if (!this.directionsService || !this.directionsRenderer) {
      console.error("Directions service or renderer not initialized");
      return;
    }

    if (!this.startLocation || !this.endLocation) {
      console.error("Start or end location not set");
      return;
    }

    if (!this.averageMPG || !this.tankCapacity) {
      console.error("Average MPG or tank capacity not set");
      return;
    }

    this.directionsService?.route(
      {
        origin: this.startLocation,
        destination: this.endLocation,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log("Route calculated successfully");
          this.directionsRenderer?.setDirections(result);

          //Get destination time for weather forecast
          let destinationTime;
          let duration = result?.routes[0]?.legs[0]?.duration?.value;
          let lat = result?.routes[0]?.legs[0]?.end_location.lat();
          let lng = result?.routes[0]?.legs[0]?.end_location.lng();

          if (duration) {
            destinationTime = Date.now() / 1000 + duration;
          }

          this.getWeather("end", lat, lng, destinationTime);

          // Get the direction steps
          const steps = result?.routes[0]?.legs[0]?.steps;
          if (steps) {
            this.showSteps(steps);
          }

          // Calculate gas usage
          const distanceMeters = result?.routes[0]?.legs[0]?.distance?.value;
          if (distanceMeters) {
            const distanceMiles = distanceMeters * 0.000621371; // Convert meters to miles
            const tanksNeeded = distanceMiles / (this.averageMPG * this.tankCapacity);
            console.log("Tanks of gas needed:", tanksNeeded);

            // Display gas usage
            const gasUsageInfoElement = document.getElementById("gas-usage-info");
            if (gasUsageInfoElement) {
              gasUsageInfoElement.textContent = `Distance: ${distanceMiles.toFixed(2)} miles. Tanks of gas needed: ${tanksNeeded.toFixed(2)}`;
            }
          } else {
            console.error("Could not calculate distance");
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }

  showSteps(steps: any[]): void {
    const stepsContainer = document.getElementById('direction-steps');
    if (stepsContainer) {
      stepsContainer.innerHTML = ""; // Clear previous steps

      steps.forEach((step: any) => {
        const stepDiv = document.createElement('div');
        stepDiv.innerHTML = step.instructions;
        stepsContainer.appendChild(stepDiv);
      });
    }
  }
}


