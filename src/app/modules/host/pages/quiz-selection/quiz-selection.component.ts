import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import { Quiz } from "@data/interfaces/quiz.model";
import { Router } from "@angular/router";
import { Round } from "@data/interfaces/round.model";
import {ComponentPortal, Portal, TemplatePortal} from "@angular/cdk/portal";
import { WelcomePortalComponent } from "@modules/host/pages/welcome-portal/welcome-portal.component";
import { QuizCreationComponent } from "@modules/host/pages/quiz-creation/quiz-creation.component";
import { QuizPreviewComponent } from "@modules/host/pages/quiz-preview/quiz-preview.component";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})

export class QuizSelectionComponent implements OnInit,AfterViewInit {
  allQuizzes: Quiz[] = [];
  allRounds: Round[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."
  selectedQuizId: number;
  selectedQuizTitle: string;

  @ViewChild('quizPreviewContent') quizPreviewContent!: TemplateRef<unknown>;
  @ViewChild('quizCreationContent') quizCreationContent!: TemplateRef<unknown>;

  defaultPortal: ComponentPortal<WelcomePortalComponent> = new ComponentPortal(WelcomePortalComponent);
  quizCreationPortal!: TemplatePortal;
  quizPreviewPortal!: TemplatePortal;
  selectedPortal: Portal<any> = this.defaultPortal;

  constructor(private _quizService: QuizService, private _router: Router, private _viewContainerRef: ViewContainerRef) {
    this.selectedQuizId = -1;
    this.selectedQuizTitle = '';
  }

  ngOnInit() {
    this.getHostQuizzes();
  }

  ngAfterViewInit() {
    this.quizCreationPortal = new TemplatePortal(this.quizCreationContent, this._viewContainerRef);
    this.quizPreviewPortal = new TemplatePortal(this.quizPreviewContent, this._viewContainerRef);
  }

  getHostQuizzes() {
    this._quizService.getAllQuizzes().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getAllRoundsByQuiz(quizId: number): void {
    this._quizService.getAllRoundsByQuiz(quizId).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allRounds = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getAllQuizRound(): void {
    this._quizService.getAllQuizRound().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        console.log(response.body);
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  redirect(quizId: number) {
    this._router.navigate([`host/preview/${quizId}`]);
  }

  setSelectedQuiz(quizId: number, quizTitle: string): void {
    this.selectedQuizId = quizId;
    console.log(this.selectedQuizId);
    this.selectedQuizTitle = quizTitle;
  }

  closePortal() {
    this.selectedPortal = this.defaultPortal;
  }
}
