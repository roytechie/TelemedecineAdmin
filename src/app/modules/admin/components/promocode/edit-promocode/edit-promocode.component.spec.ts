import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPromocodeComponent } from './edit-promocode.component';

describe('EditPromocodeComponent', () => {
  let component: EditPromocodeComponent;
  let fixture: ComponentFixture<EditPromocodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPromocodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPromocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
