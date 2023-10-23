import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundMainComponent } from './round-main.component';

describe('RoundMainComponent', () => {
  let component: RoundMainComponent;
  let fixture: ComponentFixture<RoundMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoundMainComponent]
    });
    fixture = TestBed.createComponent(RoundMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
