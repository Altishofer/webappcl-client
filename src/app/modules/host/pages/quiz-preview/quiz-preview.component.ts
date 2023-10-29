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
export class QuizPreviewComponent implements OnInit{
  allRounds: Round[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."

  @Input() selectedQuizId: number = 0;
  @Input() selectedQuizTitle: string = '';

  @Output() previewClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() startQuiz: EventEmitter<number> = new EventEmitter<number>();
  @Output() changesSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private quizService: QuizService, private router: Router) {

  }

  getAllRoundsByQuiz(quizId: number): void {
    this.quizService.getAllRoundsByQuiz(quizId).subscribe((response: any): void => {
      console.log(response.body);
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allRounds = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  ngOnInit(): void {
    this.getAllRoundsByQuiz(this.selectedQuizId);
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
