import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as polyline from 'google-polyline';
declare const google: any;
let waypoints: number[][] = [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map: any;
  @ViewChild('mapElement') mapElement!: ElementRef;
  originAutocomplete: any;
  destinationAutocomplete: any;
  directionsRenderer: any;
  PolygonBound: any;
  service!: google.maps.places.PlacesService;
  places: any[] = [];
  openInfoWindow: google.maps.InfoWindow | null = null; // Declare the openInfoWindow property
  markers: google.maps.Marker[] = []; // Array to store the markers

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    window.addEventListener('load', () => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: 42.46841179611775, lng: -98.56109182732429 },
        zoom: 4,
      });

      this.initAutocomplete();
    });
  }

  initAutocomplete(): void {
    this.originAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('origin'),
      { types: ['geocode'] }
    );
    this.destinationAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('destination'),
      { types: ['geocode'] }
    );
  }

  getDirections(): void {
    const origin = this.originAutocomplete.getPlace().formatted_address;
    const destination = this.destinationAutocomplete.getPlace().formatted_address;

    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null); // Remove previous directions from the map
    }

    const directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
      },
      (response: any, status: any) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
          waypoints = polyline.decode(response.routes[0].overview_polyline) as number[][];

          this.service = new google.maps.places.PlacesService(this.map);

          this.searchPlacesAlongRoute(); // Call the function to search for places near waypoints
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  searchPlacesAlongRoute(): void {
    const radiusMiles = 2; // Set the radius for searching places in miles
    const minimumRating = 4; // Minimum rating to include in the results

    // Clear all markers from the map
    this.clearMarkers();

    // Clear the places list
    this.places = [];

    const promises: Promise<any>[] = [];

    waypoints.forEach((waypoint: number[]) => {
      const location = { lat: waypoint[0], lng: waypoint[1] };

      const request = {
        location: location,
        radius: radiusMiles * 1609.34, // Convert miles to meters
        type: 'restaurant' // Set the type of place you want to search for
      };

      const promise = new Promise((resolve, reject) => {
        this.service.nearbySearch(request, (results: any[], status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Filter results based on minimum rating
            const filteredResults = results.filter(place => place.rating >= minimumRating);

            // Process the search results here
            this.updatePlacesList(filteredResults); // Update the places list with the filtered results

            // Add markers for each place
            filteredResults.forEach((place: any) => {
              const placeLocation = place.geometry.location;
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

            resolve(null); // Resolve with null argument
          } else {
            reject();
          }
        });
      });

      promises.push(promise);
    });

    // Wait for all promises to resolve
    Promise.all(promises)
      .then(() => {
        console.log('Places search completed.');
      })
      .catch(() => {
        console.error('Error occurred while searching for places.');
      });
  }

  updatePlacesList(results: any[]): void {
    this.places = results;
  }

  clearMarkers(): void {
    // Remove markers from the map
    this.markers.forEach((marker: google.maps.Marker) => {
      marker.setMap(null);
    });

    // Clear the markers array
    this.markers = [];
  }
}
