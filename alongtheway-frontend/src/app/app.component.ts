/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare const google: any;

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

  constructor() {}

  ngOnInit(): void {
    // Add an event listener to trigger the creation of the map when the Google Maps JavaScript API is loaded
    window.addEventListener('load', () => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: 42.46841179611775, lng: -98.56109182732429 },
        zoom: 4,
      });

      this.initAutocomplete();
    });
  }

  initAutocomplete(): void {
    // Create Autocomplete instances for the origin and destination input fields
    this.originAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('origin'),
      { types: ['geocode'] }
    );
    this.destinationAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('destination'),
      { types: ['geocode'] }
    );
  }

  search(): void {
    // Perform your search logic here
  }
}
