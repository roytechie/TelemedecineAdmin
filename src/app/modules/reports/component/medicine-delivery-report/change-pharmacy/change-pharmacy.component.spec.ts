import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePharmacyComponent } from './change-pharmacy.component';

describe('ChangePharmacyComponent', () => {
  let component: ChangePharmacyComponent;
  let fixture: ComponentFixture<ChangePharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePharmacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
