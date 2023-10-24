import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.HUB_URL + '/quizHub';
    this.createHubConnection(this.baseUrl);
  }

  private createHubConnection(url: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log(message);
      this.receiveMessageListener(message);
    });

    this.hubConnection.on('ReceiveRound', (round: string) => {
      console.log("nextRound", round);
      this.receiveRoundListener(round);
    });

    this.hubConnection.on('ReceivePlayers', (message: string) => {
      console.log("players", message);
      this.receivePlayerListener(message);
    });
  }

  public setReceiveMessageListener(listener: (message: string) => void) {
    this.receiveMessageListener = listener;
  }
  private receiveMessageListener: (message: string) => void = (message) => {
    console.log(message);
  };

  public setReceivePlayerListener(listener: (message: string) => void) {
    this.receiveMessageListener = listener;
  }
  private receivePlayerListener: (message: string) => void = (message) => {
    console.log(message);
  };
  public setReceiveRoundListener(listener: (message: string) => void) {
    this.receiveMessageListener = listener;
  }
  private receiveRoundListener: (round: string) => void = (round) => {
    console.log(round);
  };

  joinGroup(groupName: string, playerName: string){
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

  startConnection() : Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected){return Promise.resolve();}
    return this.hubConnection.start();
  }
}
