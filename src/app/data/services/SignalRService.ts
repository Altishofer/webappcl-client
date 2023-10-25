import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import {WaitResult} from "@data/interfaces/WaitResult.model";

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
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
  }

  joinGroup(groupName: string, playerName: string) {
    console.log("joinGroup", groupName, playerName);
    this.hubConnection
      .invoke('JoinGroup', groupName, playerName)
      .catch((err) => console.error('Error joining group: ' + err));
  }

  leaveGroup(groupName: string, playerName: string) {
    this.hubConnection
      .invoke('LeaveGroup', groupName, playerName)
      .catch((err) => console.error('Error leaving group: ' + err));
  }

  sendMessageToGroup(groupName: string, message: string) {
    console.log("sendMessageToGroup", groupName, message);
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

  setReceiveIntermediateResultListener(listener: (waitResult: WaitResult) => void) {
    this.hubConnection.on('ReceiveIntermediateResult', listener);
  }
}
