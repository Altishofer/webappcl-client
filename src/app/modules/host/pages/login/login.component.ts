import {Component, OnInit} from '@angular/core';
import { Host } from "app/data/interfaces/host.model";
import { HostService } from "app/data/services/host.service";
import { CookieService } from "ngx-cookie-service";
import { catchError, Observable } from "rxjs";
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";
import { Md5 } from "ts-md5";
import {ClickMode, Container, Engine, HoverMode, MoveDirection, OutMode} from "tsparticles-engine";
import {loadSlim} from "tsparticles-slim";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  errorMsg : string = '';
  loginForm: FormGroup;
  isLogin: boolean = true;
  unexpectedErrorMsg : string = "An unexpected error occurred."
  constructor(
    private hostService: HostService,
    private cookieService: CookieService,
    private router: Router,
    private fb: FormBuilder
    ) {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^(\S){1,10}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(\S){1,50}$/)]]
    });

    this.loginForm.valueChanges.subscribe(value => {
      // console.log('Form value changed', value);
    });

    this.loginForm.statusChanges.subscribe(status => {
      if (status == "VALID"){
        this.host.hostName = this.loginForm.value.username;
        this.host.hostPassword = Md5.hashStr(this.loginForm.value.password);
      }
    });
  };

  ngOnInit() {
    this.wakeUpServer();
  }

  host: Host = {
    hostName: "",
    hostPassword: ""
  };

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.errorMsg = "";
  }

  doLogin(): void {
    this.actionWrapper(this.hostService.login.bind(this.hostService), "Login");
  }

  doRegister(): void {
    this.actionWrapper(this.hostService.register.bind(this.hostService), "Register");
  }

  doAction() {
    if (this.loginForm.valid) {
      if (this.isLogin) {
        this.doLogin();
      } else {
        this.doRegister();
      }
    }
  }

  actionWrapper(serviceMethod: (host: Host) => Observable<any>, actionName: string): void {
    serviceMethod(this.host)
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
          this.cookieService.set('hostToken', response.body.token.result, new Date().setHours(new Date().getHours() + 1));
          this.cookieService.set('hostName', this.host.hostName, 1);
          this.hostService.refreshTokenPeriodically();
          this.router.navigate(["host", response.body.id, "selection"]);
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
      });
  }

  wakeUpServer() {
    this.hostService.wakeUpServer()
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
      .subscribe((response: any) => {
      console.log("Server started successfuly");
    });
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

  particlesLoaded(container: Container): void {
    console.log(container);
  }

  async particlesInit(engine: Engine): Promise<void> {
    console.log(engine);
    await loadSlim(engine);
  }
}
