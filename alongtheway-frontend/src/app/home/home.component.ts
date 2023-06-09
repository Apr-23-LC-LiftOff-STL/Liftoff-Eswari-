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
  driveTime: string = "0 hrs";
  map: google.maps.Map | null = null;
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;
  interest: string = "restaurant";
  isCollapsibleCollapsed: boolean = false;
  isSecondCollapsibleCollapsed: boolean = true;
  isThirdCollapsibleCollapsed: boolean = true;
  loading: boolean = false; // Add loading flag property
  service!: google.maps.places.PlacesService;
  places: any[] = [];
  openInfoWindow: google.maps.InfoWindow | null = null; // Declare the openInfoWindow property
  markers: google.maps.Marker[] = []; // Array to store the markers
  placeMarkers: google.maps.Marker[] = []; // Array to store the markers
  circles: google.maps.Circle[] = [];

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

          // Code for grabbing drive time
          if (result && result.routes && result.routes.length > 0 && result.routes[0].legs && result.routes[0].legs.length > 0) {
            this.driveTime = result.routes[0].legs[0].duration?.text ?? 'Unknown';
          } else {
            console.error('Invalid directions response:', result);
          }

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

          if (result && result.routes && result.routes.length > 0) {
              const tempRoute = result.routes[0].overview_path;

              this.clearPlaceMarkers();

              // Clear circles from the map
              for (let circle of this.circles) {
                  circle.setMap(null);
              }
              this.circles = []; // Reset the circles array

              let lastMarkerPosition = null;
              let milesBetweenMarkers = 0;
              let circleRadius = 0;

              if (this.distanceInMiles <= 250) {
                milesBetweenMarkers = 12; //converted to meters
                circleRadius = 8 * 1609.34;
              } else {
                milesBetweenMarkers = 40;
                circleRadius = 31 * 1609.34;
              }

              // Loop through each waypoint
              for (let i = 0; i < tempRoute.length; i++) {
                  let currentPosition = tempRoute[i];

                  // If this is the first iteration, always add marker and circle
                  if (i === 0) {
                      let marker = new google.maps.Marker({
                          position: currentPosition,
                          title: 'Waypoint ' + (i + 1)
                      });
                      this.markers.push(marker);
                      lastMarkerPosition = currentPosition;

                      // Create and store circle
                      let circle = new google.maps.Circle({
                          center: currentPosition,
                          radius: circleRadius
                      });
                      this.circles.push(circle);
                      continue; // Continue to the next iteration
                  }

                  // If this is the last iteration, always add marker and circle
                  if (i === tempRoute.length - 1) {
                      let marker = new google.maps.Marker({
                          position: currentPosition,
                          title: 'Waypoint ' + (i + 1)
                      });
                      this.markers.push(marker);

                      // Create and store circle
                      let circle = new google.maps.Circle({
                          center: currentPosition,
                          radius: circleRadius
                      });
                      this.circles.push(circle);
                      break; // End the loop
                  }

                  // For other waypoints, check if the distance is greater than set amount of miles before adding marker and circle
                  if (lastMarkerPosition && this.calculateDistanceInMiles(lastMarkerPosition, currentPosition) >= milesBetweenMarkers) {
                      let marker = new google.maps.Marker({
                          position: currentPosition,
                          title: 'Waypoint ' + (i + 1)
                      });
                      this.markers.push(marker);

                      // Update lastMarkerPosition to current position
                      lastMarkerPosition = currentPosition;

                      // Create and store circle
                      let circle = new google.maps.Circle({
                          center: currentPosition,
                          radius: circleRadius
                      });
                      this.circles.push(circle);
                  }
              }

              console.log("Number of Place API Requests: " + this.circles.length)

          } else {
              // Handle the case where result is null or doesn't have the expected structure
              console.error('Invalid result:', result);
          }

          //this.createRouteBoxes(result);

          // THIS IS THE LINE THAT TURNS ON PLACE SEARCH
          // DO NOT UNCOMMENT IT UNLESS YOU KNOW WHAT YOU ARE DOING
          // IF YOU ENABLE IT YOU WILL DRAIN OUR ACCOUNT BALANCE
          // TALK TO JONATHAN IF YOU WANT TO TEST IT
          //this.searchPlacesAlongRoute();

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

      if ((this.distanceInMiles > 0) && (this.distanceInMiles <= 99.9)) {
        this.boxes = routeBoxer.box(this.path, 1.5);
      } else if ((this.distanceInMiles >= 100) && (this.distanceInMiles <= 499.9)) {
        this.boxes = routeBoxer.box(this.path, 10);
      } else if ((this.distanceInMiles >= 500) && (this.distanceInMiles <= 999.9)) {
        this.boxes = routeBoxer.box(this.path, 20);
      } else if (this.distanceInMiles >= 1000) {
        this.boxes = routeBoxer.box(this.path, 2);
      }

      console.log('Boxes:', this.boxes);
      this.drawBoxes(this.boxes);
    }
  }

  drawBoxes(boxes: google.maps.LatLngBounds[]): void {
//       this.boxpolys = new Array(boxes.length);
//       this.circles = []; // Initialize circles array
//
//       for (let i = 0; i < boxes.length; i++) {
//         this.boxpolys[i] = new google.maps.Rectangle({
//           bounds: boxes[i],
//           fillOpacity: 0,
//           strokeOpacity: 1.0,
//           strokeColor: '#000000',
//           strokeWeight: 1,
//           map: this.map as google.maps.Map
//         });
//
//         const bounds = boxes[i];
//         const center = bounds.getCenter();
//
//         const circle = new google.maps.Circle({
//           center: center,
//           radius: 49999,
//           fillColor: '#0000FF',
//           fillOpacity: 0.5,
//           strokeColor: '#000000',
//           strokeOpacity: 1.0,
//           strokeWeight: 1,
//         });
//
//         this.circles.push(circle);
//       }
//
//       // Create a temporary array
//       let temporaryArray = [];
//
//       // Store the first element of the original array
//       if (this.circles.length > 0) {
//         temporaryArray.push(this.circles[0]);
//       }
//
//       // Store every 5th element of the original array
//       for (let i = 14; i < this.circles.length; i += 15) {
//         temporaryArray.push(this.circles[i]);
//       }
//
//       // Store the last element of the original array
//       if (this.circles.length > 0) {
//         temporaryArray.push(this.circles[this.circles.length - 1]);
//       }
//
//       // Set 'this.circles' equal to the temporary array
//       this.circles = temporaryArray;
//
//       // Draw the filtered circles on the map
//       for (const circle of this.circles) {
//         circle.setMap(this.map as google.maps.Map);
//       }


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

  calculateDriveTime(): string {
      return this.driveTime;
  }

  searchPlacesAlongRoute(): void {
      const radiusMiles = 1; // Set the radius for searching places in miles
      const minimumRating = 4; // Minimum rating to include in the results
      const maxResults = 20; // Maximum number of results to display

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
                  type: 'restaurant' // Set the type of place you want to search for
                };

                const promise = new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
                  this.service.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus, pagination: google.maps.places.PlaceSearchPagination | null) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results !== null) {
                      // Filter results based on minimum rating
                      console.log('Number of place results before filtering:', results);
                      const filteredResults = results.filter((place: google.maps.places.PlaceResult) =>
                        place.rating && place.rating >= minimumRating && place.user_ratings_total && place.user_ratings_total > 500
                      );

                      resolve(filteredResults); // Resolve with filtered results
                    } else {
                      resolve([]); // Resolve with an empty array if no results
                    }
                  });
                });

                promises.push(promise);
              }
            }); // Missing closing curly brace added here

      // Wait for all promises to resolve
      Promise.all(promises)
        .then((resultsArray: google.maps.places.PlaceResult[][]) => {
          // Concatenate all the filtered results from each request
          const combinedResults = resultsArray.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

          // Log the number of place results
          console.log('Number of place results:', combinedResults.length);

          // Remove duplicate results based on place ID
          const uniqueResults = this.removeDuplicateResults(combinedResults);

          // Sort the unique results by rating in descending order
          uniqueResults.sort((a: google.maps.places.PlaceResult, b: google.maps.places.PlaceResult) => (b.rating ?? 0) - (a.rating ?? 0));

          // Get the top-rated results up to the maximum limit
          const topResults = uniqueResults.slice(0, maxResults);

          // Process the search results here
          this.updatePlacesList(topResults); // Update the places list with the filtered results

          // Add markers for each place
                  topResults.forEach((place: google.maps.places.PlaceResult) => {
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
                    this.markers.push(marker);
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

}
