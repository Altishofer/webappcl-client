import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandrinComponent } from './sandrin.component';

describe('SandrinComponent', () => {
  let component: SandrinComponent;
  let fixture: ComponentFixture<SandrinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SandrinComponent]
    });
    fixture = TestBed.createComponent(SandrinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
