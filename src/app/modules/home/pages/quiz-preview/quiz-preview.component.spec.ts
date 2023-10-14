import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPreviewComponent } from './quiz-preview.component';

describe('QuizPreviewComponent', () => {
  let component: QuizPreviewComponent;
  let fixture: ComponentFixture<QuizPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizPreviewComponent]
    });
    fixture = TestBed.createComponent(QuizPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
