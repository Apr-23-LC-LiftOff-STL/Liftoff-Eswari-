import { Component, AfterViewInit } from '@angular/core';

declare const google: any;

interface LatLng {
  lat: number;
  lng: number;
}

interface Directions {
  routes: any[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'alongtheway-frontend';

  ngAfterViewInit(): void {
    this.loadGoogleMapsApi().then(() => {
      this.initMap();
    });
  }
  
  loadGoogleMapsApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB2X3kIDgVjzB4oBpL02fB0VMeuIg2t7b4&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
  
      document.body.appendChild(script);
    });
  }

  initMap(): void {
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 4,
      center: { lat: -24.345, lng: 134.46 }, // Australia.
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      map,
      panel: document.getElementById("panel") as HTMLElement,
    });

    directionsRenderer.addListener("directions_changed", () => {
      const directions = directionsRenderer.getDirections();

      if (directions) {
        this.computeTotalDistance(directions);
      }
    });

    document.getElementById("submit-button")?.addEventListener("click", () => {
      const origin = (document.getElementById("origin-input") as HTMLInputElement).value;
      const destination = (document.getElementById("destination-input") as HTMLInputElement).value;

      this.displayRoute(
        origin, destination, directionsService, directionsRenderer
      );
    });

    const initialOrigin = "New York City";
    const initialDestination = "Los Angeles";
    this.displayRoute(initialOrigin, initialDestination, directionsService, directionsRenderer);
  }

  displayRoute(origin: string, destination: string, service: any, display: any): void {
    service
      .route({
        origin: origin,
        destination: destination,
        waypoints: [],
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      })
      .then((result: any) => {
        display.setDirections(result);
      })
      .catch((e: Error) => {
        alert("Could not display directions due to: " + e);
      });
  }

  computeTotalDistance(result: Directions): void {
    let total = 0;
    const myroute = result.routes[0];

    if (!myroute) {
      return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }

    total = total / 1000;
    (document.getElementById("total") as HTMLElement).innerHTML = total + " km";
  }
}
