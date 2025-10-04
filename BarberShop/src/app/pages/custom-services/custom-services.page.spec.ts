import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomServicesPage } from './custom-services.page';

describe('CustomServicesPage', () => {
  let component: CustomServicesPage;
  let fixture: ComponentFixture<CustomServicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
