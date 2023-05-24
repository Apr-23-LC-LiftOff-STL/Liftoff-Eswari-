import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  placesData: any = {};  // Initialized to an empty object
  stops: {location: string}[] = [];

  environment = environment;

  constructor(private http: HttpClient) { }

  getWeather(point: string, lat?: number, lng?: number, time?: number): void {
    if (!lat || !lng) {
      return;
    }

    const apiKey = environment.weatherApiKey;
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
  interest: string = "";

  @ViewChild('mpgInput') mpgInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('tankInput') tankInputRef!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    const loader = new Loader({
      apiKey: environment.mapApiKey,
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
      for (let i = 0; i < this.stops.length; i++) {
        this.initStopAutocomplete(i);
      }
    });
  }

  initStopAutocomplete(index: number): void {
    const stopInput = document.getElementById(`stop-input-${index}`) as HTMLInputElement;
    const stopAutocomplete = new google.maps.places.Autocomplete(stopInput);
  
    stopAutocomplete.addListener("place_changed", () => {
      const place = stopAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        this.map?.setCenter(place.geometry.location);
        this.map?.setZoom(14);
        this.stops[index].location = place.formatted_address ?? "";
        console.log(`Stop location ${index}:`, this.stops[index].location);
  
        this.getWeather(`stop${index}`, place.geometry.location.lat(), place.geometry.location.lng());
      }
    });
  }
  

  initAutocomplete(): void {
    const startInput = document.getElementById("start-input") as HTMLInputElement;
    const endInput = document.getElementById("end-input") as HTMLInputElement;
    // const stopInput = document.getElementById("stop-input-{{i}}") as HTMLInputElement;
    const mpgInput = document.getElementById("mpg-input") as HTMLInputElement;
    const tankInput = document.getElementById("tank-input") as HTMLInputElement;

    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);
    // const stopAutocomplete = new google.maps.places.Autocomplete(stopInput);

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

    setTimeout(() => {
      const mpgInput = this.mpgInputRef.nativeElement;
      const tankInput = this.tankInputRef.nativeElement;

    mpgInput.addEventListener("change", () => {
        this.averageMPG = Number(mpgInput.value);
        console.log("Average MPG:", this.averageMPG);
      });
    

    tankInput.addEventListener("change", () => {
      this.tankCapacity = Number(tankInput.value);
      console.log("Tank Capacity:", this.tankCapacity);
      });
    });
  }

  submitForm(): void {
    if (!this.interest) {
      console.error("Interest not set");
      return;
    }
    
    this.calculateRoute();
  }

  

  handlePlacesData(placesData: any) {
    if (placesData.status === 'OK') {
      this.placesData = placesData;
   } else {
    console.error("Places API request failed:", placesData.status);
  }
}



  calculateRoute(): void {
    this.averageMPG = +this.averageMPG;
    this.tankCapacity = +this.tankCapacity;
    const apiKey = environment.mapApiKey;


    console.log("Calculating route...");
    console.log("Start location:", this.startLocation);
    console.log("End location:", this.endLocation);
    console.log("Interest:", this.interest);
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

    if (!this.interest) {
      console.error("Interest not set");
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
        waypoints: this.stops.map(stop => ({ location: stop.location, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log("Route calculated successfully");
          this.directionsRenderer?.setDirections(result);

          // calculate the midpoint of the route
          // const midLat = (result!.routes[0].bounds.getNorthEast().lat() + result!.routes[0].bounds.getSouthWest().lat()) / 2;
          // const midLng = (result!.routes[0].bounds.getNorthEast().lng() + result!.routes[0].bounds.getSouthWest().lng()) / 2;
          
          // console.log('Midpoint:', midLat, midLng);
          
          // new google.maps.Marker({
          //   position: {lat: midLat, lng: midLng},
          //   map: this.map,
          //   title: 'Midpoint'
          // });
          
        

        // make the Google Places API request using the PlacesService
        
    //     const placesService = new google.maps.places.PlacesService(this.map as google.maps.Map);
    //     placesService.nearbySearch({
    //           location: {lat: midLat, lng: midLng},
    //           radius: 10000,
    //           type: this.interest
    //     }, (results, status) => {
    //   if (status === google.maps.places.PlacesServiceStatus.OK) {
    //     this.handlePlacesData({results: results, status: status});
    //   } else {
    //     console.error("Places API request failed:", status);
    //   }
    // });

        // handle the placesData
        // this.http.get(placesUrl).subscribe((placesData: any) => {
        //   this.handlePlacesData(placesData);
        // });
        

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
      });
  }

  addStop() {
    const index = this.stops.length;
    this.stops.push({location: ''});
    setTimeout(() => this.initStopAutocomplete(index));
  }
  

  removeStop(index: number) {
    this.stops.splice(index, 1);
    // After this line, Angular will automatically remove the corresponding inputs
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