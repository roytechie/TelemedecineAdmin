import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubmissionsComponent } from './list-submissions.component';

describe('ListSubmissionsComponent', () => {
  let component: ListSubmissionsComponent;
  let fixture: ComponentFixture<ListSubmissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubmissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
