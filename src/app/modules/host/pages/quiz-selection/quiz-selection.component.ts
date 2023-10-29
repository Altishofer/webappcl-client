import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import { Router } from "@angular/router";
import { Round } from "@data/interfaces/round.model";
import {ComponentPortal, Portal, TemplatePortal} from "@angular/cdk/portal";
import { WelcomePortalComponent } from "@app/modules/host/pages/welcome-portal/welcome-portal.component";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit,AfterViewInit {
  allQuizzes!: [{hostId: number, id: number, title: string, rounds: Round[]}];
  allRoundsOfQuiz: Round[] = [];
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

  constructor(private _quizService: QuizService, private _router: Router, private _viewContainerRef: ViewContainerRef, private _cookieService: CookieService) {
    this.selectedQuizId = -1;
    this.selectedQuizTitle = '';
  }

  ngOnInit() {
    this.getQuizzesWithRounds();
  }

  ngAfterViewInit() {
    this.quizCreationPortal = new TemplatePortal(this.quizCreationContent, this._viewContainerRef);
    this.quizPreviewPortal = new TemplatePortal(this.quizPreviewContent, this._viewContainerRef);
  }

  getQuizzesWithRounds(): void {
    this._quizService.getQuizzesWithRounds().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getHostName(): string {
    return this._cookieService.get('hostName');
  }

  redirect(quizId: number) {
    this._router.navigate([`host/preview/${quizId}`]);
  }

  setSelectedQuiz(quizId: number, quizTitle: string): void {
    this.selectedQuizId = quizId;
    this.selectedQuizTitle = quizTitle;
  }

  getSelectedQuizRounds(requestedQuizId: number): Round[] {
    for (let pos: number = 0; pos < this.allQuizzes.length; pos++) {
      if (this.allQuizzes[pos].id === requestedQuizId) {
        this.allRoundsOfQuiz = this.allQuizzes[pos].rounds;
        return this.allRoundsOfQuiz;
      }
    }
    return [];
  }

  closePortal() {
    this.selectedPortal = this.defaultPortal;
  }

  startQuiz() {
    console.log(`Theoretically starting quiz "${this.selectedQuizTitle}"...`)
  }

  saveChanges() {
    console.log(`Theoretically saving changes to quiz "${this.selectedQuizTitle}"...`)
  }

  saveCreation() {
    console.log(`Theoretically saving newly created quiz...`)
  }
}
