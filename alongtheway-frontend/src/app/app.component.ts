import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  service!: google.maps.places.PlacesService;

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

          const PolygonCoords = this.PolygonPoints();
          const PolygonBound = new google.maps.Polygon({
            paths: PolygonCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          });

          PolygonBound.setMap(this.map);

          this.service = new google.maps.places.PlacesService(this.map);

        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  PolygonPoints(): typeof FullPoly {
    let polypoints = waypoints;
    let PolyLength = polypoints.length;

    let UpperBound: google.maps.LatLngLiteral[] = [];
    let LowerBound: google.maps.LatLngLiteral[] = [];

    for (let j = 0; j <= PolyLength - 1; j++) {
      let NewPoints = this.PolygonArray(polypoints[j][0]);
      UpperBound.push({ lat: NewPoints[0], lng: polypoints[j][1] });
      LowerBound.push({ lat: NewPoints[1], lng: polypoints[j][1] });
    }
    let reversebound = LowerBound.reverse();

    let FullPoly = UpperBound.concat(reversebound);

    return FullPoly;
  }

  PolygonArray(latitude: number): number[] {
    const R = 6378137;
    const pi = 3.14;
    //distance in meters
    const upper_offset = 8000;
    const lower_offset = -8000;

    const Lat_up = upper_offset / R;
    const Lat_down = lower_offset / R;
    //OffsetPosition, decimal degrees
    const lat_upper = latitude + (Lat_up * 180) / pi;
    const lat_lower = latitude + (Lat_down * 180) / pi;

    return [lat_upper, lat_lower];
  }
}
