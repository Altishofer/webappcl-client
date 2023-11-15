import {ChangeDetectorRef, Component} from '@angular/core';
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {HostService} from "@data/services/host.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {FullResult} from "@data/interfaces/FullResult";

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
  hostId : string = '';
  fullResults : FullResult[] = [];
  anotherRound : boolean = false;

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
      this.hostId = params['hostId']
    });
    this.anotherRound = this.cookieService.get("roundIds").length > 0;
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
      this.router.navigate(['/host', this.hostId, 'round', this.quizId, round]);
    });
  }

  registerToGroup() {
    this.signalRService.joinGroup(this.quizId);
  }

  getIntermediateResult(): void {
    this.hostService.getFullResult(this.quizId, this.roundId).pipe(
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
        this.errorMsg = '';
        this.fullResults = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }


  startGame() {
    let rounds : string = this.cookieService.get("roundIds");
    if (!rounds || rounds.length == 0){
      this.router.navigate(['/host', this.hostId, 'results', this.quizId, -1]);
    } else {
      let roundId : string = "";
      let roundIds : string[] = rounds.split(",");
      roundId = roundIds.shift() as string;
      this.cookieService.set("roundIds", roundIds.join(","), new Date().setHours(new Date().getHours() + 1));
      this.pushRound(roundId);
      this.router.navigate(['/host', this.hostId, 'round', this.quizId, roundId]);
    }
  }

  pushRound(roundId : string) {
    this.hostService.pushRound(roundId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(JSON.stringify(error.error));
          if (error.status != 500) {
            this.errorMsg = error.error;
          } else {
            this.errorMsg = this.unexpectedErrorMsg;
          }
          return[];
        })
      )
      .subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          console.log("REST pushRound: ", response.body);
        } else {
          console.log("ERROR: updating rounds via REST");
        }
      });
  }

  returnToHome() {
    this.router.navigate(['/host', this.hostId, 'selection']);
  }
}
