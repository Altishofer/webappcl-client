import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { PlayerService } from "@data/services/player.service";
import { SignalRService } from "@data/services/SignalRService";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit {
  quizId!: string;
  players: string[] = [];
  nextRound: string = "";
  playerName: string = "";
  messages: string[] = [];

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
    this.players.push(this.playerName);
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
    this.signalRService.setReceiveMessageListener((message: string) => {
      console.log("SOCKET message:", message);
      this.messages.push(message);
    });

    this.signalRService.setReceivePlayerListener((player: string) => {
      console.log("SOCKET player: ", player);
      this.players = player.split(" ");
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      console.log("SOCKET round: ", round);
      this.router.navigate(['/player', 'game', this.quizId, round, this.playerName]);
    });
  }
}
