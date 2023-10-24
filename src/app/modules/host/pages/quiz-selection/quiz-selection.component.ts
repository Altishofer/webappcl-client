import {Component, inject, OnInit} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import {Quiz} from "@data/interfaces/quiz.model";
import {Host} from "@data/interfaces/host.model";
import {catchError, Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit {
  allQuizzes: Quiz[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."

  constructor(private quizService: QuizService, private router: Router) {}

  getHostQuizzes() {
    this.quizService.getAllQuizzes().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  ngOnInit() {
    this.getHostQuizzes();
  }

  redirect(quizId: number) {
    this.router.navigate([`host/preview/${quizId}`])
  }
}
