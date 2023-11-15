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
    private route: ActivatedRoute
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
    this.signalRService.joinGroup(this.quizId);
  }

  unregisterFromGroup() {
    this.signalRService.leaveGroup(this.quizId);
  }

  registerListeners(): void {
    this.signalRService.setReceiveMessageListener((message: string) => {
      this.messages.push(message);
    });

    this.signalRService.setReceivePlayerListener((player: string) => {
      this.players = player.split(" ");
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      this.router.navigate(['/player', 'game', this.quizId, round, this.playerName]);
    });
  }
}
