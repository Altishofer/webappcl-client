import {ChangeDetectorRef, Component} from '@angular/core';
import {IntermediateResult} from "@data/interfaces/IntermediateResult.model";
import {Answer} from "@data/interfaces/answer.model";
import {WaitResult} from "@data/interfaces/WaitResult.model";
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {HostService} from "@data/services/host.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  quizId : string = '';
  roundId : string = '';
  playerName : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."
  errorMsg : string = '';

  intermediateResult : IntermediateResult[] = [];

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
    });
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerToGroup();
      this.registerListeners();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getIntermediateResult();
  }


  registerListeners(): void {
    this.signalRService.setReceiveRoundListener((round: string) => {
      console.log("SOCKET round: ", round);
      this.router.navigate(['/host', 'round', this.quizId, round]);
    });
  }

  registerToGroup() {
    console.log("SOCKET: registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId);
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


  startGame() {
    let roundId : string = "";
    let rounds : string = this.cookieService.get("roundIds");
    let roundIds : string[] = rounds.split(",");
    if (roundIds.length != 0){
      roundId = roundIds.shift() as string;
      this.cookieService.set("roundIds", roundIds.join(","));
      this.pushRound(roundId);
      this.router.navigate(['/host', 'round', this.quizId, roundId]);
    } else {
      this.router.navigate(['/host', 'results', this.quizId]);
    }
  }

  pushRound(roundId : string) {
    this.hostService.pushRound(roundId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          console.log("REST pushRound: ", response.body);
        } else {
          console.log("ERROR: updating rounds via REST");
        }
      });
  }
}
