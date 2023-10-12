import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { User } from "@data/interfaces/user.model";
import { environment } from "../../../../../environments/environment";
import { SignalRService } from "../../../../data/services/SignalRService";

@Component({
  selector: 'app-sandrin',
  templateUrl: './sandrin.component.html',
  styleUrls: ['./sandrin.component.css'],
})
export class SandrinComponent {
  @ViewChild('inputBox') inputBox!: ElementRef;
  @ViewChild('outputBox') resultBox!: ElementRef;

  private baseUrl = environment.API_URL + "/TodoItems";
  private groupName: string = "0";
  public messages: string[] = [];
  public messageToSend: string = '';

  constructor(
    private http: HttpClient,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.setReceiveMessageListener((message: string) => {
      this.messages.push(message);
    });
  }

  getServerStatus() {
    this.http.get(`${this.baseUrl}/status`)
      .subscribe(
        (response: any) => {
          console.log('Success: ', response.message);
        },
        (error) => {
          console.error('Error: Failed to get data from baseUrl:', error);
        }
      );
  }

  registerToGroup() {
    this.signalRService.joinGroup(this.groupName);
  }

  unregisterFromGroup() {
    this.signalRService.leaveGroup(this.groupName);
  }

  sendMessage() {
    if (this.messageToSend) {
      this.signalRService.sendMessageToGroup(this.groupName, this.messageToSend);
      this.messageToSend = '';
    }
  }
}
