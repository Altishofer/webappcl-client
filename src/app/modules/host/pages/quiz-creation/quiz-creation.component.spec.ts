import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreationComponent } from './quiz-creation.component';

describe('QuizCreationComponent', () => {
  let component: QuizCreationComponent;
  let fixture: ComponentFixture<QuizCreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizCreationComponent]
    });
    fixture = TestBed.createComponent(QuizCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
