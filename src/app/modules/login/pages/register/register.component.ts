import { Component } from '@angular/core';
import { HostService } from "@data/services/host.service";
import {Host} from "@data/interfaces/host.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private hostService: HostService) {
  }

  host: Host = {
    hostName: "",
    hostPassword: ""
  };

  addHost() {
    this.hostService.register(this.host);
  }

  onKey_hostName(value: string) {
    this.host.hostName = value;
  }

  onKey_password(value: string) {
    this.host.hostPassword = value;
  }
}
