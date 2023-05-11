import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  map: any;
  @ViewChild('mapElement') mapElement: any;
  @ViewChild('origin', { static: true }) origin: any;
  @ViewChild('destination', { static: true }) destination: any;

  constructor() {}

  ngAfterViewInit(): void {
    // Add an event listener to trigger the creation of the map when the Google Maps JavaScript API is loaded
    window.addEventListener('load', () => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: 42.46841179611775, lng: -98.56109182732429 },
        zoom: 4,
      });
    });
  }

  ngOnInit(): void {}
}
