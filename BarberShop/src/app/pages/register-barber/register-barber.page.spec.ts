import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterBarberPage } from './register-barber.page';

describe('RegisterBarberPage', () => {
  let component: RegisterBarberPage;
  let fixture: ComponentFixture<RegisterBarberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterBarberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
