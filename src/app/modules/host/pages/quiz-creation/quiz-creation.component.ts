import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {QuizService} from "@data/services/quiz.service";
import {Quiz} from "@data/interfaces/quiz.model";

@Component({
  selector: 'app-quiz-creation',
  templateUrl: './quiz-creation.component.html',
  styleUrls: ['./quiz-creation.component.css']
})
export class QuizCreationComponent {
  @Output() creationClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() creationSaved: EventEmitter<Quiz> = new EventEmitter<Quiz>();

  creationQuiz!: Quiz;

  constructor(private _quizService: QuizService) {}

  closeCreation(): void {
    this.creationClosed.emit(true);
  }

  saveCreation() {
    this.creationSaved.emit(this.creationQuiz);
  }
}
