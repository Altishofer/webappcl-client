import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinComponent } from './join.component';

describe('MainpageComponent', () => {
  let component: JoinComponent;
  let fixture: ComponentFixture<JoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinComponent]
    });
    fixture = TestBed.createComponent(JoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
