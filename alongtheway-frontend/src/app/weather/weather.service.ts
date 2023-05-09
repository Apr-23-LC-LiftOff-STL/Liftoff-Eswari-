import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from './weather-data';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    apiKey: string = '8cab3c364814f611340d4aa2e6d26d6c';
    apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

    constructor(private http: HttpClient) { }

    getWeather(city: string, units: string): Observable<WeatherData> {
        const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=${units}`;
        return this.http.get<WeatherData>(url);
    }
}