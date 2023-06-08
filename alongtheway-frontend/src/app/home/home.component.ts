import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environments';
import RouteBoxer from 'src/assets/javascript/RouteBoxer.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  placesData: any = {};  // Initialized to an empty object
  stops: { location: string }[] = [];
  boxpolys: google.maps.Rectangle[] = [];
  boxes: google.maps.LatLngBounds[] = [];//routeBoxer.box(path, range);
  path: google.maps.LatLng[] = [];

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

          let iconElement = document.getElementById(`weather-icon-${point}`) as HTMLElement;
          iconElement.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");

          let tempElement = document.getElementById(`weather-temp-${point}`) as HTMLElement;
          tempElement.textContent = Math.round(weatherTemp) + "°F";
        }
      });
    });
  }

  title = 'alongtheway-frontend';
  startLocation: string = "";
  endLocation: string = "";
  averageMPG: number = 30;
  tankCapacity: number = 10;
  totalGallonsNeeded: number = 0;
  gallonGasPrice: number = 3.5;
  gallonGasPriceString: string = "3.50";
  distanceInMiles: number = 0;
  distanceInMeters: number = 0;
  map: google.maps.Map | null = null;
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;
  interest: string = "";
  isCollapsibleCollapsed: boolean = false;
  isSecondCollapsibleCollapsed: boolean = true;
  isThirdCollapsibleCollapsed: boolean = true;

  @ViewChild('mpgInput') mpgInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('tankInput') tankInputRef!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    const loader = new Loader({
      apiKey: environment.apiKey,
      libraries: ['places']
    });

    loader.load().then(() => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: { lat: 39.828175, lng: -98.5795 },
          zoom: 4
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

        this.getWeather("start-input", place.geometry.location.lat(), place.geometry.location.lng());
      }
    });

    endAutocomplete.addListener("place_changed", () => {
      const place = endAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        this.map?.setCenter(place.geometry.location);
        this.map?.setZoom(14);
        this.endLocation = place.formatted_address ?? "";
        console.log("End location:", this.endLocation);

        this.getWeather("end-input", place.geometry.location.lat(), place.geometry.location.lng());
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
//     if (!this.interest) {
//       console.error("Interest not set");
//       return;
//     }

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
    const apiKey = environment.apiKey;

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

//     if (!this.interest) {
//       console.error("Interest not set");
//       return;
//     }
//
//     if (!this.averageMPG || !this.tankCapacity) {
//       console.error("Average MPG or tank capacity not set");
//       return;
//     }

    this.directionsService?.route(
      {
        origin: this.startLocation,
        destination: this.endLocation,
        waypoints: this.stops.map(stop => ({ location: stop.location, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {

        this.clearBoxes();

        if (status === google.maps.DirectionsStatus.OK) {
          console.log("Route calculated successfully");
          this.directionsRenderer?.setDirections(result);

          this.createRouteBoxes(result);

          // calculate the midpoint of the route + old places code
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

          this.getWeather("end-input", lat, lng, destinationTime);

          // Get the direction steps
          const steps = result?.routes[0]?.legs[0]?.steps;
          if (steps) {
            this.showSteps(steps);
          }

//           // Calculate gas usage //This is old code no longer needed
//           const distanceMeters = result?.routes[0]?.legs[0]?.distance?.value;
//           if (distanceMeters) {
//             const distanceMiles = distanceMeters * 0.000621371; // Convert meters to miles
//             const tanksNeeded = distanceMiles / (this.averageMPG * this.tankCapacity);
//             console.log("Tanks of gas needed:", tanksNeeded);
//
//             // Display gas usage
//             const gasUsageInfoElement = document.getElementById("gas-usage-info");
//             if (gasUsageInfoElement) {
//               gasUsageInfoElement.textContent = `Distance: ${distanceMiles.toFixed(2)} miles. Tanks of gas needed: ${tanksNeeded.toFixed(2)}`;
//             }
//           } else {
//             console.error("Could not calculate distance");
//           }
        } else {
          console.error("Directions request failed:", status);
        }
      });
  }

  addStop() {
    const index = this.stops.length;
    this.stops.push({ location: '' });
    setTimeout(() => this.initStopAutocomplete(index));
  }

  removeStop(index: number) {
    this.stops.splice(index, 1);
    // After this line, Angular will automatically remove the corresponding inputs
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

        this.getWeather(`stop-input-${index}`, place.geometry.location.lat(), place.geometry.location.lng());
      }
    });
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

  createRouteBoxes(result: google.maps.DirectionsResult | null): void {
    if (result === null) {
        console.error("Directions result is null");
        return;
    }

    if (result && result.routes && result.routes.length > 0) {
      const polyline: google.maps.Polyline = new google.maps.Polyline({
        path: result.routes[0]?.overview_path || [],
      });

      this.path = polyline.getPath().getArray();
    } else {
      console.error("Directions request failed:", status);
      // Handle the case when result is null or there are no routes
    }

    let routeBoxer = new RouteBoxer();

    this.clearBoxes();

    this.distanceInMeters = result?.routes[0]?.legs[0]?.distance?.value as number;
    console.log("Distance in meters: ", this.distanceInMeters);

    if (this.distanceInMeters) {
      this.distanceInMiles = this.distanceInMeters * 0.000621371; // Convert meters to miles
      console.log("Distance in miles: ", this.distanceInMiles);

      if ((this.distanceInMiles > 0) && (this.distanceInMiles <= 99.9)) {
        this.boxes = routeBoxer.box(this.path, 1.5);
      } else if ((this.distanceInMiles >= 100) && (this.distanceInMiles <= 499.9)) {
        this.boxes = routeBoxer.box(this.path, 10);
      } else if ((this.distanceInMiles >= 500) && (this.distanceInMiles <= 999.9)) {
        this.boxes = routeBoxer.box(this.path, 20);
      } else if (this.distanceInMiles >= 1000) {
        this.boxes = routeBoxer.box(this.path, 80);
      }

      console.log('Boxes:', this.boxes);
      this.drawBoxes(this.boxes);
    }
  }

  drawBoxes(boxes: google.maps.LatLngBounds[]): void {
    this.boxpolys = new Array(boxes.length);
    for (let i = 0; i < boxes.length; i++) {
      this.boxpolys[i] = new google.maps.Rectangle({
        bounds: boxes[i],
        fillOpacity: 0,
        strokeOpacity: 1.0,
        strokeColor: '#000000',
        strokeWeight: 1,
        map: this.map as google.maps.Map
      });
    }
  }

  clearBoxes(): void {
        if (this.boxpolys != null) {
          for (let i = 0; i < this.boxpolys.length; i++) {
            this.boxpolys[i].setMap(null);
          }
        }
        this.boxpolys = [];
  }

  toggleCollapsible(): void {
    this.isCollapsibleCollapsed = !this.isCollapsibleCollapsed;
  }

  toggleSecondCollapsible(): void {
    this.isSecondCollapsibleCollapsed = !this.isSecondCollapsibleCollapsed;
  }

  toggleThirdCollapsible(): void {
    this.isThirdCollapsibleCollapsed = !this.isThirdCollapsibleCollapsed;
  }

  distanceInMetersToMiles(): string {
    // Convert distanceInMeters to miles here
    const distanceInMiles = this.distanceInMeters * 0.000621371;
    return (distanceInMiles.toFixed(2) + " miles"); // Adjust decimal places as needed
  }

  calculateTotalGasCost() {
    // Retrieve the value from the gasPrice variable
    const distanceInMiles = this.distanceInMeters * 0.000621371;
    const totalGallonsNeeded = (distanceInMiles / this.averageMPG);
    const gasPriceTotal = (totalGallonsNeeded * Number(this.gallonGasPriceString));

    // Format the value as currency
    const formattedGasPrice = gasPriceTotal.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    // Return the formatted value
    return formattedGasPrice;
  }

  calculateTotalGallons(): string {
    const distanceInMiles = this.distanceInMeters * 0.000621371;
    const totalGallonsNeeded = (distanceInMiles / this.averageMPG);
    const formattedTotalGallonsNeeded: string = totalGallonsNeeded.toFixed(1);
    return formattedTotalGallonsNeeded;
  }

  calculateTanksNeeded(): string {
    let tanksNeeded = (Number(this.calculateTotalGallons()) / this.tankCapacity);
    let tanksNeededString = tanksNeeded.toFixed(1);
    return tanksNeededString;
  }

}
