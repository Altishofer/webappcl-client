import {Component, EventEmitter, Output} from '@angular/core';
import {QuizService} from "@data/services/quiz.service";

@Component({
  selector: 'app-quiz-creation',
  templateUrl: './quiz-creation.component.html',
  styleUrls: ['./quiz-creation.component.css']
})
export class QuizCreationComponent {
  @Output() creationClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private _quizService: QuizService) {}

  closeCreation(): void {
    this.creationClosed.emit(true);
  }
}
