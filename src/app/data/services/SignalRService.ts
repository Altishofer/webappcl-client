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
  }

  public setReceiveMessageListener(listener: (message: string) => void) {
    this.receiveMessageListener = listener;
  }

  private receiveMessageListener: (message: string) => void = (message) => {
    console.log(JSON.stringify(message));
  };

  joinGroup(groupName: string, channel?: string) {
    this.hubConnection
      .invoke('JoinGroup', groupName, channel)
      .catch((err) => console.error('Error joining group: ' + err));
  }

  joinGroup2(groupName: string) {
    this.hubConnection
      .invoke('JoinGroup2', groupName)
      .catch((err) => console.error('Error joining group: ' + err));
  }

  leaveGroup(groupName: string, channel?: string) {
    this.hubConnection
      .invoke('LeaveGroup', groupName, channel)
      .catch((err) => console.error('Error leaving group: ' + err));
  }

  sendMessageToGroup(groupName: string, channel: string, message: string) {
    this.hubConnection
      .invoke('SendMessageToGroup', groupName, channel, message)
      .catch((err) => {
        console.error('Error sending message: ' + err);
      });
  }

  startConnection() : Promise<void> {
    return this.hubConnection.start();
  }
}
