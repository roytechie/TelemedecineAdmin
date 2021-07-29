import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignStatesComponent } from './assign-states.component';

describe('AssignStatesComponent', () => {
  let component: AssignStatesComponent;
  let fixture: ComponentFixture<AssignStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
