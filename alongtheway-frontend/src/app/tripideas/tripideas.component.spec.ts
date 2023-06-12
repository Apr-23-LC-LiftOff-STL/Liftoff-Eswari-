import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripideasComponent } from './tripideas.component';

describe('TripideasComponent', () => {
  let component: TripideasComponent;
  let fixture: ComponentFixture<TripideasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripideasComponent]
    });
    fixture = TestBed.createComponent(TripideasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
