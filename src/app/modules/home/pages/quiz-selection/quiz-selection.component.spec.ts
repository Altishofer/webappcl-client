import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSelectionComponent } from './quiz-selection.component';

describe('HomeComponent', () => {
  let component: QuizSelectionComponent;
  let fixture: ComponentFixture<QuizSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizSelectionComponent]
    });
    fixture = TestBed.createComponent(QuizSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
