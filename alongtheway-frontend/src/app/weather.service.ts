import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    constructor(private http: HttpClient) { }

    getweather(city: string, units: string) {
        return this.http.get('https://api.openweathermap.org/data/2.5/weather?q=' + city + ',us&APPID=8cab3c364814f611340d4aa2e6d26d6c&units=' + units);
    }
}
