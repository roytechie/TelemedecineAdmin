import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendmailPatientComponent } from './sendmail-patient.component';

describe('SendmailPatientComponent', () => {
  let component: SendmailPatientComponent;
  let fixture: ComponentFixture<SendmailPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendmailPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendmailPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
