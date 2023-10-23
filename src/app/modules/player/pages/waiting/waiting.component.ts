import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SignalRService} from "@data/services/SignalRService";
import {environment} from "../../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})

export class WaitingComponent{
  @ViewChild('inputBox') inputBox!: ElementRef;
  @ViewChild('outputBox') resultBox!: ElementRef;

  public players: string[] = [];
  public nextRound: string = '';
  public player: string = '';
  public quizId: string = '';

  constructor(
    private http: HttpClient,
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.player = this.cookieService.get('playerName');
    this.players.push(this.player);
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
    });
  }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.setReceiveMessageListener((player: string) => {
      this.players.push(player);
    });
  }

  registerToGroup() {
    this.signalRService.joinGroup(this.quizId);
  }

  unregisterFromGroup() {
    this.signalRService.leaveGroup(this.quizId);
  }
}
