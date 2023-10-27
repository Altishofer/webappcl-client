import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {WaitResult} from "@data/interfaces/WaitResult.model";
import {Answer} from "@data/interfaces/answer.model";
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, CanActivate, CanActivateFn, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {IntermediateResult} from "@data/interfaces/IntermediateResult.model";
import {HostService} from "@data/services/host.service";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit{
  quizId : string = '';
  roundId : string = '';
  playerName : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."
  errorMsg : string = '';

  intermediateResult : IntermediateResult[] = [];

  answer : Answer = {
    quizId: "",
    roundId: "",
    playerName: "",
    additions: [],
    subtractions: [],
    answerTarget: "",
  };

  waitResult : WaitResult = {
    notAnsweredPlayerName : [],
    answeredPlayerName : []
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private playerService: PlayerService,
    private hostService : HostService
  ) {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.roundId = params['roundId'];
      this.playerName = params['playerName'];
    });
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerToGroup();
      this.registerListeners();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getWaitResult();
    this.getIntermediateResult();
  }

  registerToGroup() {
    console.log("SOCKET: registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId);
  }

  get answeredPercentage() {
    return Math.round(this.waitResult.answeredPlayerName.length / (this.waitResult.notAnsweredPlayerName.length + this.waitResult.answeredPlayerName.length) * 100);
  }

  get unansweredPercentage() {
    return Math.round(100 - this.answeredPercentage);
  }

  getWaitResult(): void {
    console.log("REST: getWaitResult", this.quizId, this.roundId);
    this.hostService.getWaitResult(this.quizId, this.roundId).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(JSON.stringify(error.error));
        if (error.status != 500) {
          this.errorMsg = error.error;
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
        return[];
      })
    ).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        console.log(response.body)
        this.errorMsg = '';
        this.waitResult = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getIntermediateResult(): void {
    console.log("REST: getIntermediateResult", this.quizId, this.roundId);
    this.hostService.getIntermediateResult(this.quizId, this.roundId).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(JSON.stringify(error.error));
        if (error.status != 500) {
          this.errorMsg = error.error;
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
        return[];
      })
    ).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        console.log(response.body);
        this.errorMsg = '';
        this.intermediateResult = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  registerListeners(): void {
    this.signalRService.setReceiveWaitResultListener((waitResult: WaitResult) => {
      console.log("SOCKET waitResult: ", waitResult)
      this.waitResult = waitResult;
    });
  }

  switchToRound(roundId:number): void {
    this.router.navigate(['/player', 'game', this.quizId, roundId, this.playerName]);
  }
}
