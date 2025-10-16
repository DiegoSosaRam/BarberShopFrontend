import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualifyBarberPage } from './qualify-barber.page';

describe('QualifyBarberPage', () => {
  let component: QualifyBarberPage;
  let fixture: ComponentFixture<QualifyBarberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifyBarberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
