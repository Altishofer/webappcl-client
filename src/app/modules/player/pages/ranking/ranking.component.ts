import {Component, OnInit} from '@angular/core';
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {FullResult} from "@data/interfaces/FullResult";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit{
  quizId!: string;
  playerName: string = "";
  fullResults : FullResult[] = [];
  roundId : string = '';

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
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
