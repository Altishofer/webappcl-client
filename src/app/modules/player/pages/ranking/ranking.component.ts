import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {WaitResult} from "@data/interfaces/WaitResult.model";
import {Answer} from "@data/interfaces/answer.model";
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, CanActivate, CanActivateFn, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {HostService} from "@data/services/host.service";
import {FullResult} from "@data/interfaces/FullResult";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit{
  quizId!: string;
  nextRound: string = "";
  playerName: string = "";
  fullResults : FullResult[] = [];
  roundId : string = '';

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private playerService: PlayerService
  ) {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.playerName = params['playerName'];
      this.roundId = params['roundId'];

    });
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerListeners();
      this.registerToGroup();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
  }

  registerToGroup() {
    this.signalRService.joinGroup(this.quizId);
  }

  unregisterFromGroup() {
    this.signalRService.leaveGroup(this.quizId);
  }

  registerListeners(): void {

    this.signalRService.setReceiveFullResultListener((results: FullResult[]) => {
      this.fullResults = results;
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      console.log("SOCKET round: ", round);
      this.router.navigate(['/player', 'game', this.quizId, round, this.playerName]);
    });
  }

}
