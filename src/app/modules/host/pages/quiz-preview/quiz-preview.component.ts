import {Component, OnInit} from '@angular/core';
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
  quizId!: string;
  quiz!: Quiz;
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."

  constructor(private quizService: QuizService, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
    });
  }

  getAllRoundsByQuiz(quizId: string): void {
    this.quizService.getAllRoundsByQuiz(quizId).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allRounds = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getQuiz(quizId: string): void {
    this.quizService.getQuiz(quizId).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.quiz = response.body["quizDto"];
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  ngOnInit(): void {
    this.getQuiz(this.quizId);
    this.getAllRoundsByQuiz(this.quizId);
  }

  roundsPresent(position: number): boolean {
    console.log(this.allRounds[position].forbiddenWords.length > 0)
    return this.allRounds[position].forbiddenWords.length > 0;
  }
}
