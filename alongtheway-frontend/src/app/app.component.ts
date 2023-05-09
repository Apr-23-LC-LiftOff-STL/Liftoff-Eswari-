import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { WeatherService } from './weather.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  selector: 'app-weather',

})
export class AppComponent implements OnInit {
  title = 'alongtheway-frontend';
  startLocation: string = "";
  endLocation: string = "";
  map: google.maps.Map | null = null;
  directionsService: google.maps.DirectionsService | null = null;
  directionsRenderer: google.maps.DirectionsRenderer | null = null;

  ngOnInit(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyC7TfA2reVISM_h9MIhhaoUH6FXsopH8ZA',
      libraries: ['places']
    });

    loader.load().then(() => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: { lat: 51.233334, lng: 6.78333 },
          zoom: 6
        });
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
          map: this.map
        });
        this.initAutocomplete();
      } else {
        console.error("Could not find map element");
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
      }
    });

    endAutocomplete.addListener("place_changed", () => {
      const place = endAutocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        this.map?.setCenter(place.geometry.location);
        this.map?.setZoom(14);
        this.endLocation = place.formatted_address ?? "";
        console.log("End location:", this.endLocation);
      }
    });
  }

  calculateRoute(): void {
    console.log("Calculating route...");
    console.log("Start location:", this.startLocation);
    console.log("End location:", this.endLocation);

    if (!this.directionsService || !this.directionsRenderer) {
      console.error("Directions service or renderer not initialized");
      return;
    }

    if (!this.startLocation || !this.endLocation) {
      console.error("Start or end location not set");
      return;
    }

    this.directionsService.route(
      {
        origin: this.startLocation,
        destination: this.endLocation,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log("Route calculated successfully");
          this.directionsRenderer?.setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
      
   
      export class WeatherComponent implements OnInit {
      myWeather: any;
      temperature: number = 0;
      feelsLikeTemp: number = 0;
      humidity: number = 0;
      pressure: number = 0;
      summary: string = '';
      iconURL: string = '';
      city: string = 'Saint Louis';
      units: string = 'imperial';

      constructor(private weatherService: WeatherService) { }

      ngOnInit(): void {
        this.weatherService.getweather(this.city, this.units).subscribe({

          next: (res) => {
            console.log(res);
            this.myWeather = res;
            console.log(this.myWeather);
            this.temperature = this.myWeather.main.temp;
            this.feelsLikeTemp = this.myWeather.main.feels_like;
            this.humidity = this.myWeather.main.humidity;
            this.pressure = this.myWeather.main.pressure;
            this.summary = this.myWeather.weather[0].main;

            this.iconURL = 'https://openweathermap.org/img/wn/' + this.myWeather.weather[0].icon + '@2x.png';
          },

          error: (error) => console.log(error.message),

          complete: () => console.info('API call completed')
        })
      }

    }
    );
  }


}
