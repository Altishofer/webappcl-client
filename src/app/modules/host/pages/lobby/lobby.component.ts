import { Component } from '@angular/core';
import { SignalRService } from "@data/services/SignalRService";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { HostService } from "@data/services/host.service";
import { Options } from 'ngx-qrcode-styling';
import { catchError} from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ClickMode, Container, Engine, HoverMode, MoveDirection, OutMode } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  public config: Options = {
    template: 'ocean',
    data : 'default',
    frameOptions: {
      style: 'F_036',
      width: 300,
      height: 300
    }
  };
  QRvalue = '';
  quizId: string = '';
  players: string[] = [];
  unexpectedErrorMsg : string = "An unexpected error occurred."
  errorMsg : string = '';
  roundIds : string[] = [];
  hostId : string = '';
  joinUrl : string = '';

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private hostService: HostService
  ) {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.hostId = params['hostId'];
    });
    this.QRvalue = this.hostService.ngUrl + 'player/register/' + this.quizId;
    this.joinUrl = this.hostService.ngUrl ? this.hostService.ngUrl.replace('http://', '') + 'join/' : "";
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerListeners();
      this.registerToGroup();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getRounds();
  }

  getPlayers(): void {
    this.hostService.getPlayers(this.quizId)
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
      .subscribe((response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          if (response.body.message == ""){
            this.players = [];
          } else {
            this.players = response.body.message.split(" ");
          }
        } else {
          console.log("ERROR: updating players via REST");
        }
      });
  }

  getRounds(): void {
    this.hostService.getAllRoundIdsByQuiz(this.quizId)
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
          this.roundIds = response.body;
          this.cookieService.set("roundIds", this.roundIds.join(","), new Date().setHours(new Date().getHours() + 1));
          this.getPlayers();
        } else {
          console.log("ERROR: updating roundIds via REST");
        }
      });
  }

  registerToGroup() {
    this.signalRService.joinGroup(this.quizId);
  }

  unregisterFromGroup() {
    this.signalRService.leaveGroup(this.quizId);
  }

  registerListeners(): void {
    this.signalRService.setReceivePlayerListener((player: string) => {
      this.players = player.split(" ");
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      this.router.navigate(['/host', this.hostId, 'round', this.quizId, round]);
    });
  }

  startGame() {
    let roundId : string = "";
    let rounds : string = this.cookieService.get("roundIds");
    let roundIds : string[] = rounds.split(",");
    if (roundIds.length != 0){
      roundId = roundIds.shift() as string;
      this.cookieService.set("roundIds", roundIds.join(","), new Date().setHours(new Date().getHours() + 1));
      this.pushRound(roundId);
    } else {
      this.router.navigate(['/host', this.hostId, 'results', this.quizId, -1]);
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
        } else {
          console.log("ERROR: updating rounds via REST");
        }
      });
  }

  isLobbyJoined(): boolean {
    return this.players.length !== 0;
  }


  //tsParticles definition
  id = "tsparticles-overlay";

  particlesOptions = {
    background: {
      opacity: 0
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: false,
          mode: ClickMode.push,
        },
        onHover: {
          enable: true,
          mode: HoverMode.repulse,
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff"
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: true,
        speed: {min: 1, max: 6},
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  particlesLoaded(container: Container): void {}

  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }

  protected readonly URL = URL;
}
