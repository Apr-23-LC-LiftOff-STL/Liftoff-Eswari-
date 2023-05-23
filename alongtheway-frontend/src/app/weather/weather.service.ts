import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from './weather-data';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

// Access the API key




@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    apiKey: string = environment.weatherApiKey;
    apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

    constructor(private http: HttpClient) { }

    getWeather(city: string, units: string): Observable<WeatherData> {
        const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=${units}`;
        return this.http.get<WeatherData>(url);
    }
}