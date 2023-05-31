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
  loading: boolean = false; // Add loading flag property
  @ViewChild('mapElement') mapElement!: ElementRef;
  originAutocomplete: any;
  destinationAutocomplete: any;
  directionsRenderer: any;
  service!: google.maps.places.PlacesService;
  places: any[] = [];
  openInfoWindow: google.maps.InfoWindow | null = null; // Declare the openInfoWindow property
  markers: google.maps.Marker[] = []; // Array to store the markers

  constructor(private http: HttpClient) { }

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

    this.loading = true; // Enable loading flag

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
          this.loading = false; // Disable loading flag in case of failure
        }
      }
    );
  }

  searchPlacesAlongRoute(): void {
    const radiusMiles = 1; // Set the radius for searching places in miles
    const minimumRating = 4; // Minimum rating to include in the results
    const maxResults = 20; // Maximum number of results to display

    // Clear all markers from the map
    this.clearMarkers();

    // Clear the places list
    this.places = [];

    const promises: Promise<google.maps.places.PlaceResult[]>[] = [];

    waypoints.forEach((waypoint: number[]) => {
      const location = { lat: waypoint[0], lng: waypoint[1] };

      const request = {
        location: location,
        radius: radiusMiles * 1609.34, // Convert miles to meters
        type: 'restaurant' // Set the type of place you want to search for
      };

      const promise = new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        this.service.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus, pagination: google.maps.places.PlaceSearchPagination | null) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results !== null) {
            // Filter results based on minimum rating
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
    });

    // Wait for all promises to resolve
    Promise.all(promises)
      .then((resultsArray: google.maps.places.PlaceResult[][]) => {
        // Concatenate all the filtered results from each request
        const combinedResults = resultsArray.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);

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

  clearMarkers(): void {
    // Remove markers from the map
    this.markers.forEach((marker: google.maps.Marker) => {
      marker.setMap(null);
    });

    // Clear the markers array
    this.markers = [];
  }


}
