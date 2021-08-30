import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineDeliveryReportComponent } from './medicine-delivery-report.component';

describe('MedicineDeliveryReportComponent', () => {
  let component: MedicineDeliveryReportComponent;
  let fixture: ComponentFixture<MedicineDeliveryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineDeliveryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineDeliveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
