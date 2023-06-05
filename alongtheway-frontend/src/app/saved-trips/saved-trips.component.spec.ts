import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTripsComponent } from './saved-trips.component';

describe('SavedTripsComponent', () => {
  let component: SavedTripsComponent;
  let fixture: ComponentFixture<SavedTripsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedTripsComponent]
    });
    fixture = TestBed.createComponent(SavedTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
