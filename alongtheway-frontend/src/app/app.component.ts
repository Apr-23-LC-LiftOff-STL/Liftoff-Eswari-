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
  markers: google.maps.Marker[] = []; // Declare the markers array

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

          // Clear all markers from the map
          this.clearMarkers();

          this.searchPlacesAlongRoute(); // Call the function to search for places near waypoints

        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  searchPlacesAlongRoute(): void {
    const radiusMiles = 10; // Set the radius for searching places in miles
    const minimumRating = 4; // Minimum rating to include in the results

    const route = this.directionsRenderer.getDirections().routes[0];
    const overviewPath = route.overview_path;

    overviewPath.forEach((point: google.maps.LatLng) => {
      const location = point;

      const request = {
        location: location,
        radius: radiusMiles * 1609.34, // Convert miles to meters
        type: 'restaurant' // Set the type of place you want to search for
      };

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

            // Add the marker to the markers array
            this.markers.push(marker);
          });
        }
      });
    });
  }

  updatePlacesList(results: any[]): void {
    this.places = results;
  }

  clearMarkers(): void {
    // Loop through all the markers and set their map property to null
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }

    // Clear the markers array
    this.markers = [];
  }
}
