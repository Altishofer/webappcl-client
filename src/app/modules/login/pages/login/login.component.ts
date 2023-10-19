import { Component } from '@angular/core';
import { Host } from "@data/interfaces/host.model";
import { HostService } from "@data/services/host.service";
import {CookieService} from "ngx-cookie-service";
import {catchError, Observable, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMsg : string = '';
  loginForm: FormGroup;
  isLogin: boolean = true;
  unexpectedErrorMsg : string = "An unexpected error occurred."
  constructor(private hostService: HostService, private cookieService: CookieService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^(\S){1,50}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(\S){1,50}$/)]]
    });

    this.loginForm.valueChanges.subscribe(value => {
      // console.log('Form value changed', value);
    });

    this.loginForm.statusChanges.subscribe(status => {
      if (status == "VALID"){
        this.host.hostName = this.loginForm.value.username;
        this.host.hostPassword = this.loginForm.value.password;
      }
      console.log('Form status changed', status);
    });
  };

  host: Host = {
    hostName: "",
    hostPassword: ""
  };

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.errorMsg = "";
    this.loginForm.value.hostName = "";
    this.loginForm.value.hostPassword = "";
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
          console.log(JSON.stringify(error));
          if (error.status != 500) {
            this.errorMsg = error.error || this.unexpectedErrorMsg;
          } else {
            this.errorMsg = this.unexpectedErrorMsg;
          }
          return throwError(this.unexpectedErrorMsg);
        })
      )
      .subscribe((response: any): void => {
        if (response.ok) {
          this.cookieService.set('token', response.token);
          this.cookieService.set('hostName', this.host.hostName);
          console.log(actionName + " was successful: " + this.host.hostName + ", received token: " + response.token);
          this.hostService.refreshTokenPeriodically();
          this.router.navigate(['/home']);
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
      });
  }
}
