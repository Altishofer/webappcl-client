import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCalcComponent } from './word-calc.component';

describe('WordCalcComponent', () => {
  let component: WordCalcComponent;
  let fixture: ComponentFixture<WordCalcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordCalcComponent]
    });
    fixture = TestBed.createComponent(WordCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
