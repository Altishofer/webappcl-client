import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuizService} from "@data/services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Round} from "@data/interfaces/round.model";
import {Quiz} from "@data/interfaces/quiz.model";

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export class QuizPreviewComponent {
  allRounds: Round[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."

  @Input() selectedQuizId: number = 0;
  @Input() selectedQuizTitle: string = '';
  @Input() selectedQuizRounds: Round[] = [];

  @Output() previewClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() startQuiz: EventEmitter<number> = new EventEmitter<number>();
  @Output() changesSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private quizService: QuizService, private router: Router) {

  }

  roundsPresent(position: number): boolean {
    return this.allRounds[position].forbiddenWords.length > 0;
  }

  start() : void {
    this.startQuiz.emit(this.selectedQuizId);
  }

  closePreview(): void {
    this.previewClosed.emit(true);
  }

  saveChanges(): void {
    this.changesSaved.emit(true);
  }
}
