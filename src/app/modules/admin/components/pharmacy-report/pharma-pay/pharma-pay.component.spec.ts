import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaPayComponent } from './pharma-pay.component';

describe('PharmaPayComponent', () => {
  let component: PharmaPayComponent;
  let fixture: ComponentFixture<PharmaPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmaPayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
