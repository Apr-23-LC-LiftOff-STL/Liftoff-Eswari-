import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface RoadTrip {
  id: string;
  name: string;
  duration: string;
  description: string;
  distance: string;
  keyHighlights: string;
}

@Component({
  selector: 'app-tripideas',
  templateUrl: './tripideas.component.html',
  styleUrls: ['./tripideas.component.css']
})
export class TripideasComponent implements OnInit {
  roadTrips: RoadTrip[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<RoadTrip[]>('http://localhost:8080/roadtrips')
      .subscribe(
        data => { this.roadTrips = data; },
        error => { console.error('There was an error!', error); }
      );
  }


}
