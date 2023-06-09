import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Observable } from 'rxjs';
import RouteBoxer from 'src/assets/javascript/RouteBoxer.js';
import { environment } from 'src/environments/environments';
import { AuthService } from '../services/auth.service';

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

  constructor(private http: HttpClient, public authService: AuthService) { }


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
  averageMPG: number | undefined;
  tankCapacity: number | undefined;
  averageMPG$: Observable<number | null> | undefined;
  tankCapacity$: Observable<number | null> | undefined;
  totalGallonsNeeded: number = 0;
  gallonGasPrice: number = 3.5;
  gallonGasPriceString: string = "3.50";
  distanceInMiles: number = 0;
  distanceInMeters: number = 0;
  driveTime: string = "0 hrs";
  map: google.maps.Map | null = null;
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;
  interest: string = "";
  isCollapsibleCollapsed: boolean = false;
  isSecondCollapsibleCollapsed: boolean = true;
  isThirdCollapsibleCollapsed: boolean = true;
  isFourthCollapsibleCollapsed: boolean = true;
  loading: boolean = false; // Add loading flag property
  service!: google.maps.places.PlacesService;
  places: any[] = [];
  openInfoWindow: google.maps.InfoWindow | null = null; // Declare the openInfoWindow property
  markers: google.maps.Marker[] = []; // Array to store the markers
  placeMarkers: google.maps.Marker[] = []; // Array to store the markers
  circles: google.maps.Circle[] = [];
  showSearchResults: boolean = false;
  debugShapes: string = "none";
  totalSessionAPICalls: number = 0;
  circleAPICalls: number = 0;

  @ViewChild('mpgInput') mpgInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('tankInput') tankInputRef!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    const loader = new Loader({
      apiKey: environment.apiKey,
      libraries: ['places']
    });

    this.interest = "";

    this.authService.getMpg.subscribe(mpg => {
      this.averageMPG = mpg;
      // Calculate the gas cost or perform any other necessary actions
      // this.calculateTotalGasCost();
    });

    this.authService.getTankCapacity.subscribe(tankCapacity => {
      this.tankCapacity = tankCapacity;
      // Calculate the number of tanks needed or perform any other necessary actions
      // this.calculateTanksNeeded();
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

  getUserDetails() {
    this.authService.getMpg.subscribe(
      (mpg) => {
        console.log('MPG:', mpg);
      },
      (error) => {
        console.error('Error retrieving MPG:', error);
      }
    );

    this.authService.getTankCapacity.subscribe(
      (tankCapacity) => {
        console.log('Tank Capacity:', tankCapacity);
      },
      (error) => {
        console.error('Error retrieving Tank Capacity:', error);
      }
    );
  }

  initAutocomplete(): void {
    const startInput = document.getElementById("start-input") as HTMLInputElement;
    const endInput = document.getElementById("end-input") as HTMLInputElement;

    const startAutocomplete = new google.maps.places.Autocomplete(startInput);
    const endAutocomplete = new google.maps.places.Autocomplete(endInput);

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
        this.service = new google.maps.places.PlacesService(this.map); // Initialize PlacesService
        for (let i = 0; i < this.stops.length; i++) {
          this.initStopAutocomplete(i);
        }
      } else {
        console.error("Could not find map element");
      }

      // setTimeout(() => {
      //   const mpgInput = this.mpgInputRef.nativeElement;
      //   const tankInput = this.tankInputRef.nativeElement;

      //   mpgInput.addEventListener("change", () => {
      //     this.averageMPG = Number(mpgInput.value);
      //     console.log("Average MPG:", this.averageMPG);
      //   });

      //   tankInput.addEventListener("change", () => {
      //     this.tankCapacity = Number(tankInput.value);
      //     console.log("Tank Capacity:", this.tankCapacity);
      //   });
      // });
    });
  }

  submitForm(): void {
    this.calculateRoute();
//
//     setTimeout(() => {
//       this.displaySearchShapes();
//     }, 500); // 1000 milliseconds = 1 second
  }

  handlePlacesData(placesData: any) {
    if (placesData.status === 'OK') {
      this.placesData = placesData;
    } else {
      console.error("Places API request failed:", placesData.status);
    }
  }

  calculateRoute(): void {
    const apiKey = environment.apiKey;

    this.showSearchResults = false;
    this.places = [];
    this.interest = "";

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

    this.directionsService?.route(
      {
        origin: this.startLocation,
        destination: this.endLocation,
        waypoints: this.stops.map((stop) => ({ location: stop.location, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        this.clearBoxes();

        if (status === google.maps.DirectionsStatus.OK) {
          console.log("Route calculated successfully");
          this.directionsRenderer?.setDirections(result);

          // Code for grabbing drive time
          if (result && result.routes && result.routes.length > 0 && result.routes[0].legs && result.routes[0].legs.length > 0) {
            // Calculate drive time
            let totalDriveTime = 0;
            for (const leg of result.routes[0].legs) {
              if (leg.duration && leg.duration.value) {
                totalDriveTime += leg.duration.value;
              } else {
                console.error("Invalid leg duration:", leg);
              }
            }
            const minutes = Math.floor((totalDriveTime % 3600) / 60);
            let driveTime;
            if (totalDriveTime <= 59 * 60) {
              driveTime = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
            } else {
              const hours = Math.floor(totalDriveTime / 3600);
              driveTime = `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`;
            }
            this.driveTime = driveTime;
          } else {
            console.error("Invalid directions response:", result);
          }

          // Calculate total distance
          let totalDistanceInMeters = 0;
          if (result && result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            if (route && route.legs && route.legs.length > 0) {
              for (const leg of route.legs) {
                if (leg.distance && leg.distance.value) {
                  totalDistanceInMeters += leg.distance.value;
                }
              }
            }
          }
          this.distanceInMeters = totalDistanceInMeters;
          this.distanceInMiles = this.distanceInMeters * 0.000621371;

          // Process the route
          if (result && result.routes && result.routes.length > 0) {
            const tempRoute = result.routes[0].overview_path;

            this.clearPlaceMarkers();

            for (const box of this.boxpolys) {
              box.setMap(null);
            }
            for (const circle of this.circles) {
              circle.setMap(null);
            }

            this.circles = []; // Reset the circles array

            let lastMarkerPosition = null;
            let milesBetweenMarkers = 0;
            let circleRadius = 0;

            if (this.distanceInMiles <= 250) {
              milesBetweenMarkers = 12; // Converted to meters
              circleRadius = 8 * 1609.34;
            } else {
              milesBetweenMarkers = 40;
              circleRadius = 31 * 1609.34;
            }

            // Loop through each waypoint
            for (let i = 0; i < tempRoute.length; i++) {
              const currentPosition = tempRoute[i];

              // If this is the first iteration, always add marker and circle
              if (i === 0) {
                const marker = new google.maps.Marker({
                  position: currentPosition,
                  title: "Waypoint " + (i + 1),
                });
                this.markers.push(marker);
                lastMarkerPosition = currentPosition;

                // Create and store circle
                const circle = new google.maps.Circle({
                  center: currentPosition,
                  radius: circleRadius,
                });
                this.circles.push(circle);
                continue; // Continue to the next iteration
              }

              // If this is the last iteration, always add marker and circle
              if (i === tempRoute.length - 1) {
                const marker = new google.maps.Marker({
                  position: currentPosition,
                  title: "Waypoint " + (i + 1),
                });
                this.markers.push(marker);

                // Create and store circle
                const circle = new google.maps.Circle({
                  center: currentPosition,
                  radius: circleRadius,
                });
                this.circles.push(circle);

                if (lastMarkerPosition && this.calculateDistanceInMiles(lastMarkerPosition, currentPosition) <= 5) {
                  this.circles.splice(this.circles.length - 1, 1);
                }

                break; // End the loop
              }

              // For other waypoints, check if the distance is greater than the set amount of miles before adding marker and circle
              if (lastMarkerPosition && this.calculateDistanceInMiles(lastMarkerPosition, currentPosition) >= milesBetweenMarkers) {
                const marker = new google.maps.Marker({
                  position: currentPosition,
                  title: "Waypoint " + (i + 1),
                });
                this.markers.push(marker);

                // Update lastMarkerPosition to current position
                lastMarkerPosition = currentPosition;

                // Create and store circle
                const circle = new google.maps.Circle({
                  center: currentPosition,
                  radius: circleRadius,
                });
                this.circles.push(circle);
              }
            }

              this.createRouteBoxes(result);

            // Get destination time for weather forecast
            let destinationTime;
            const duration = result?.routes[0]?.legs[0]?.duration?.value;
            const lat = result?.routes[0]?.legs[0]?.end_location.lat();
            const lng = result?.routes[0]?.legs[0]?.end_location.lng();
            if (duration) {
              destinationTime = Date.now() / 1000 + duration;
            }
            this.getWeather("end-input", lat, lng, destinationTime);

            // Get the direction steps
            const steps = result?.routes[0]?.legs[0]?.steps;
            if (steps) {
              this.showSteps(steps);
            }
          } else {
            console.error("Invalid result:", result);
          }

        } else {
          console.error("Directions request failed:", status);
        }

        this.displaySearchShapes();
      }
    );
  }

  addStop() {
    const index = this.stops.length;
    this.stops.push({ location: '' });
    setTimeout(() => this.initStopAutocomplete(index));
  }

  removeStop(index: number) {
    this.stops.splice(index, 1);
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

    let totalDistanceInMeters = 0;

    if (result && result.routes && result.routes.length > 0) {
      const route = result.routes[0];

      if (route && route.legs && route.legs.length > 0) {
        for (const leg of route.legs) {
          if (leg.distance && leg.distance.value) {
            totalDistanceInMeters += leg.distance.value;
          }
        }
      }
    }

    this.distanceInMeters = totalDistanceInMeters;

    if (this.distanceInMeters) {
      this.distanceInMiles = this.distanceInMeters * 0.000621371; // Convert meters to miles
      console.log("Distance in miles: ", this.distanceInMiles);

        this.boxes = routeBoxer.box(this.path, 2);

      this.drawBoxes(this.boxes);
    }
  }

  drawBoxes(boxes: google.maps.LatLngBounds[]): void {
      this.boxpolys = new Array(boxes.length);
      console.log("BOXPOLY LENGTH: " + this.boxpolys.length);
      console.log("NUMBER OF BOXES: " + this.boxes.length);

      for (let i = 0; i < boxes.length; i++) {
        this.boxpolys[i] = new google.maps.Rectangle({
          bounds: boxes[i],
          fillOpacity: 0,
          strokeOpacity: 1.0,
          strokeColor: '#000000',
          strokeWeight: 1//,
          //map: this.map as google.maps.Map
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

  toggleFourthCollapsible(): void {
      this.isFourthCollapsibleCollapsed = !this.isFourthCollapsibleCollapsed;
  }

  distanceInMetersToMiles(): string {
    // Convert distanceInMeters to miles here
    const distanceInMiles = this.distanceInMeters * 0.000621371;
    return (distanceInMiles.toFixed(2) + " miles"); // Adjust decimal places as needed
  }

  calculateTotalGasCost() {
    const distanceInMiles = this.distanceInMeters * 0.000621371;
    let totalGallonsNeeded = 0;

    // Check if this.averageMPG is not null before using it
    if (this.averageMPG) {
        totalGallonsNeeded = distanceInMiles / this.averageMPG;
    } else {
        // You can decide what to do here when averageMPG is null
        // For example, return an error message or set a default value
        // console.error('Average MPG is not set');
        return;
    }

    const gasPriceTotal = totalGallonsNeeded * Number(this.gallonGasPriceString);

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
    let totalGallonsNeeded = 0;

    // Check if this.averageMPG is not null before using it
    if (this.averageMPG) {
        totalGallonsNeeded = distanceInMiles / this.averageMPG;
    } else {
        // You can decide what to do here when averageMPG is null
        // For example, return an error message or set a default value
        // console.error('Average MPG is not set');
        return '';
    }

    const formattedTotalGallonsNeeded: string = totalGallonsNeeded.toFixed(1);
    return formattedTotalGallonsNeeded;
  }

  calculateTanksNeeded(): string {
    // Check if this.tankCapacity is not null before using it
    if (this.tankCapacity) {
        let tanksNeeded = Number(this.calculateTotalGallons()) / this.tankCapacity;
        let tanksNeededString = tanksNeeded.toFixed(1);
        return tanksNeededString;
    } else {
        // You can decide what to do here when tankCapacity is null
        // For example, return an error message or set a default value
        // console.error('Tank Capacity is not set');
        return '';
    }
  }

  calculateDriveTime(): string {
      return this.driveTime;
  }

  searchPlacesAlongRoute(): void {
      this.circleAPICalls = this.circles.length;
      this.totalSessionAPICalls += this.circles.length;

      const minimumRating = 1; // Minimum rating to include in the results
      this.showSearchResults = true;

      if (this.interest == "") {
        return;
      }

      // Clear all markers from the map
      this.clearPlaceMarkers();

      // Clear the places list
      this.places = [];

      const promises: Promise<google.maps.places.PlaceResult[]>[] = [];

            this.circles.forEach((circle: google.maps.Circle) => {
              const center = circle.getCenter(); // Get the center of the circle
              const radius = circle.getRadius(); // Get the radius of the circle in meters

              if (center) {
                const request = {
                  location: center,
                  radius: radius,
                  type: this.interest // Set the type of place you want to search for
                };

                const promise = new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
                  this.service.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus, pagination: google.maps.places.PlaceSearchPagination | null) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results !== null) {
                      // Filter results based on minimum rating
                      console.log('Number of place results before filtering:', results);
                      const filteredResults = results.filter((place: google.maps.places.PlaceResult) =>
                        place.rating && place.rating >= minimumRating && place.user_ratings_total && place.user_ratings_total > 3
                      );

                      console.log('Number of place results after filtering:', results);

                      resolve(filteredResults); // Resolve with filtered results
                    } else {
                      resolve([]); // Resolve with an empty array if no results
                    }
                  });
                });

                promises.push(promise);
              }
            });

      // Wait for all promises to resolve
      Promise.all(promises)
        .then((resultsArray: google.maps.places.PlaceResult[][]) => {
          // Concatenate all the filtered results from each request
          const combinedResults = resultsArray.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

          // Log the number of place results
          console.log('Number of initial place results for entire route: ', combinedResults.length);

          // Remove duplicate results based on place ID
          const uniqueResults = this.removeDuplicateResults(combinedResults);

          console.log('Number of initial place results after duplicates are removed: ', uniqueResults.length);

          // Sort the unique results by rating in descending order
          uniqueResults.sort((a: google.maps.places.PlaceResult, b: google.maps.places.PlaceResult) => (b.rating ?? 0) - (a.rating ?? 0));

//           // Get the top-rated results up to the maximum limit
//           const topResults = uniqueResults.slice(0, maxResults);

          // Process the search results here
          this.updatePlacesList(uniqueResults); // Update the places list with the filtered results

          // Add markers for each place
                  uniqueResults.forEach((place: google.maps.places.PlaceResult) => {
                    const placeLocation = place.geometry!.location;
                    const marker = new google.maps.Marker({
                      position: placeLocation,
                      map: this.map,
                      title: place.name
                    });

                    // Create an info window for the marker
                    const infoWindow = new google.maps.InfoWindow({
                      content: `<strong>${place.name}</strong><br>${place.vicinity}`
                    });

                    // Add a click event listener to the marker
                    marker.addListener('click', () => {
                      // Close the previously open info window
                      if (this.openInfoWindow) {
                        this.openInfoWindow.close();
                      }

                      // Open the new info window
                      infoWindow.open(this.map, marker);
                      this.openInfoWindow = infoWindow; // Update the currently open info window
                    });

                    // Store the marker in the markers array
                    this.placeMarkers.push(marker);
                  });

          console.log('Places search completed.');
          this.loading = false; // Disable loading flag after search completion
        })
        .catch(() => {
          console.error('Error occurred while searching for places.');
          this.loading = false; // Disable loading flag in case of error
        });
    }

  removeDuplicateResults(results: google.maps.places.PlaceResult[]): google.maps.places.PlaceResult[] {
      const uniqueResults: google.maps.places.PlaceResult[] = [];
      const placeIds: string[] = [];

      results.forEach((result: google.maps.places.PlaceResult) => {
        const placeId = result.place_id;
        if (placeId && !placeIds.includes(placeId)) {
          uniqueResults.push(result);
          placeIds.push(placeId);
        }
      });

      return uniqueResults;
    }

  updatePlacesList(results: any[]): void {
      console.log('Updated places:', results);
      this.places = [...results];
    }

  clearPlaceMarkers(): void {
      // Remove markers from the map
      this.placeMarkers.forEach((marker: google.maps.Marker) => {
        marker.setMap(null);
      });

      // Clear the markers array
      this.placeMarkers = [];
    }

  calculateDistanceInMiles(position1: google.maps.LatLng, position2: google.maps.LatLng): number {
      const R = 3958.8; // Radius of the Earth in miles
      const dLat = (position2.lat() - position1.lat()) * Math.PI / 180;
      const dLon = (position2.lng() - position1.lng()) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(position1.lat() * Math.PI / 180) * Math.cos(position2.lat() * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
  }

  getAddressComponent(addressComponents: any[]): string {
  if (addressComponents && addressComponents.length > 0) {
    const administrativeArea = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
    return administrativeArea ? administrativeArea.short_name : '';
  }
  return '';
}

  displaySearchShapes(): void {
    for (const box of this.boxpolys) {
      box.setMap(null);
    }
    for (const circle of this.circles) {
      circle.setMap(null);
    }
    switch (this.debugShapes) {
      case 'none':
        for (const circle of this.circles) {
          circle.setMap(null);
        }
        for (const box of this.boxpolys) {
          box.setMap(null);
        }
        break;
      case 'circles':
        for (const box of this.boxpolys) {
            box.setMap(null);
        }
        for (const circle of this.circles) {
            circle.setMap(this.map);
        }
        break;
      case 'routeboxer':
        for (const circle of this.circles) {
            circle.setMap(null);
        }
        for (const box of this.boxpolys) {
            box.setMap(this.map);
        }
        break;
      case 'both':
        for (const circle of this.circles) {
            circle.setMap(this.map);
        }
        for (const box of this.boxpolys) {
            box.setMap(this.map);
        }
        break;
      default:
        for (const circle of this.circles) {
          circle.setMap(null);
        }
        for (const box of this.boxpolys) {
          box.setMap(null);
        }
        break;
    }
  }

  getGooglePlaceUrl(place: any): string {
    return 'https://www.google.com/maps/place/?q=place_id:' + place.place_id;
  }

}
