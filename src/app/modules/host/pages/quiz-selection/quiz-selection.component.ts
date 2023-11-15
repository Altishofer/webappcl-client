import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
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
  allQuizzes!: [{hostId: number, quizId: number, title: string, rounds: Round[]}];
  allRoundsOfQuiz: Round[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred.";
  selectedQuizId: number = -1;
  selectedQuizTitle: string = "";
  selectedQuizHostId: number = -1;
  hostId!: number;
  tooltipMessage: string = "This word is not valid, please enter a different one."

  @ViewChild('quizPreviewContent') quizPreviewContent!: TemplateRef<unknown>;

  defaultPortal: ComponentPortal<WelcomePortalComponent> = new ComponentPortal(WelcomePortalComponent);
  quizPreviewPortal!: TemplatePortal;
  selectedPortal: Portal<any> = this.defaultPortal;

  constructor(
      private _quizService: QuizService,
      private _router: Router,
      private _viewContainerRef: ViewContainerRef,
      private _cookieService: CookieService,
      private router: Router,
      private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.hostId = Number(params['hostId']);
    });
  }

  ngOnInit() {
    this.getQuizzesWithRounds();
  }

  ngAfterViewInit() {
    this.quizPreviewPortal = new TemplatePortal(this.quizPreviewContent, this._viewContainerRef);
  }

  getQuizzesWithRounds(): void {
    this._quizService.getQuizzesWithRounds().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
        this.allQuizzes.push({hostId: this.hostId, quizId: -1, title: "New quiz", rounds: [{id:"-1", roundTarget:"", quizId: "-1", forbiddenWords:[""]}]});
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getHostName(): string {
    return this._cookieService.get('hostName');
  }

  redirect(quizId: number) {
    this._router.navigate(["host", this.hostId, "preview",  quizId]);
  }

  setSelectedQuiz(quizId: number, quizTitle: string, hostId : number): void {
    this.selectedQuizId = quizId;
    this.selectedQuizTitle = quizTitle;
    this.selectedQuizHostId = hostId;
  }

  getSelectedQuizRounds(requestedQuizId: number): Round[] {
    for (let pos: number = 0; pos < this.allQuizzes.length; pos++) {
      if (this.allQuizzes[pos].quizId === requestedQuizId) {
        this.allRoundsOfQuiz = this.allQuizzes[pos].rounds;
        return this.allRoundsOfQuiz;
      }
    }
    return [];
  }

  closePortal() {
    this.selectedQuizId = -1;
    this.selectedQuizTitle = "";
    this.selectedQuizHostId = -1;
    this.allRoundsOfQuiz = [];
    this.selectedPortal = this.defaultPortal;
  }

  refresh(){
    this.closePortal();
    this.getQuizzesWithRounds();
    this.ngAfterViewInit();
  }

  startQuiz() {
    this.router.navigate(['/host', this.hostId, 'lobby', this.selectedQuizId]);
  }

  saveCreation() {
    console.log(`Theoretically saving newly created quiz...`);
  }
}
