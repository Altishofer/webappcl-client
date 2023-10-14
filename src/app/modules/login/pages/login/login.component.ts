import { Component } from '@angular/core';
import { Host } from "@data/interfaces/host.model";
import { HostService } from "@data/services/host.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private hostService: HostService) {}

  host: Host = {
    hostName: "",
    hostPassword: ""
  };

  doLogin() {
    this.hostService.login(this.host);
  }

  onKey_hostName(value: string) {
    this.host.hostName = value;
  }

  onKey_password(value: string) {
    this.host.hostPassword = value;
  }
}
