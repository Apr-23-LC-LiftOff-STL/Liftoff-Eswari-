import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutusandfaqComponent } from './aboutusandfaq.component';

describe('AboutusandfaqComponent', () => {
  let component: AboutusandfaqComponent;
  let fixture: ComponentFixture<AboutusandfaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutusandfaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutusandfaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
