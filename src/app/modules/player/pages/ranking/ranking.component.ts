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
  quizId!: string;
  nextRound: string = "";
  playerName: string = "";
  intermediateResult : IntermediateResult[] = [];

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
    console.log("SOCKET: registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId);
  }

  unregisterFromGroup() {
    console.log("SOCKET: unregister from group", this.quizId);
    this.signalRService.leaveGroup(this.quizId);
  }

  registerListeners(): void {
    this.signalRService.setReceiveIntermediateResultListener((results: IntermediateResult[]) => {
      console.log("SOCKET round: ", results);
      this.intermediateResult = results;
      console.log("SOCKET: intermediateResults")
    });

    this.signalRService.setReceiveFinalResultListener((results: IntermediateResult[]) => {
      console.log("SOCKET round: ", results);
      this.intermediateResult = results;
      console.log("SOCKET: finalResults")
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      console.log("SOCKET round: ", round);
      this.router.navigate(['/player', 'game', this.quizId, round, this.playerName]);
    });
  }

}
