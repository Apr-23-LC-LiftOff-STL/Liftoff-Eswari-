import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasCalculatorComponent } from './gas-calculator.component';

describe('GasCalculatorComponent', () => {
  let component: GasCalculatorComponent;
  let fixture: ComponentFixture<GasCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GasCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
