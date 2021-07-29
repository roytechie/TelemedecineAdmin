import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubmissionDialogComponent } from './update-submission-dialog.component';

describe('UpdateSubmissionDialogComponent', () => {
  let component: UpdateSubmissionDialogComponent;
  let fixture: ComponentFixture<UpdateSubmissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSubmissionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSubmissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
