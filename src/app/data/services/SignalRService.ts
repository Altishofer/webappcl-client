import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import {WaitResult} from "@data/interfaces/WaitResult.model";
import {FullResult} from "@data/interfaces/FullResult";

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  constructor() {
    const baseUrl = environment.HUB_URL + '/quizHub';
    this.createHubConnection(baseUrl);
  }

  private createHubConnection(url: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
  }

  joinGroup(groupName: string) {
    this.hubConnection
      .invoke('JoinGroup', groupName)
      .catch((err) => console.error('Error joining group: ' + err));
  }

  leaveGroup(groupName: string) {
    this.hubConnection
      .invoke('LeaveGroup', groupName)
      .catch((err) => console.error('Error leaving group: ' + err));
  }

  sendMessageToGroup(groupName: string, message: string) {
    this.hubConnection
      .invoke('SendMessageToGroup', groupName, message)
      .catch((err) => {
        console.error('Error sending message: ' + err);
      });
  }

  startConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return Promise.resolve();
    } else {
      return this.hubConnection.start();
    }
  }

  setReceiveMessageListener(listener: (message: string) => void) {
    this.hubConnection.on('ReceiveMessage', listener);
  }

  setReceivePlayerListener(listener: (message: string) => void) {
    this.hubConnection.on('ReceivePlayers', listener);
  }

  setReceiveRoundListener(listener: (round: string) => void) {
    this.hubConnection.on('ReceiveRound', listener);
  }

  setReceiveWaitResultListener(listener: (waitResult: WaitResult) => void) {
    this.hubConnection.on('ReceiveWaitResult', listener);
  }

  setReceiveFullResultListener(listener: (fullResults: FullResult[]) => void) {
    this.hubConnection.on('ReceiveFullResult', listener);
  }

  setReceiveNavigateListener(listener: (round: string) => void) {
    this.hubConnection.on('ReceiveNavigate', listener);
  }
}
