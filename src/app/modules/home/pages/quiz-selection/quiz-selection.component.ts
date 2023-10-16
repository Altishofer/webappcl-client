import {Component, inject, OnInit} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import {Quiz} from "@data/interfaces/quiz.model";
import {ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit {
  allQuizzes: Quiz[] = [];

  constructor(private quizService: QuizService, private activatedRoute: ActivatedRoute) {
  }

  getHostQuizzes() {
    this.allQuizzes = this.quizService.getAllQuizzes();
  }

  ngOnInit() {
    this.getHostQuizzes();
  }
}
