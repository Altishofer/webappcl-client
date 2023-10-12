


// Angular client code
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private baseUrl = environment.HUB_URL + "/chatHub";

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(this.baseUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log(message);
      this.receiveMessageListener(message);
    });
  }

  public setReceiveMessageListener(listener: (message: string) => void) {
    console.log("setReceiveMessageListener")
    this.receiveMessageListener = listener;
  }

  private receiveMessageListener: (message: string) => void = (message) => {};

  joinGroup(groupName: string) {
    console.log("join Group " + groupName);
    this.hubConnection.invoke('JoinGroup', groupName)
      .catch(err => console.error('Error joining group: ' + err));
  }

  leaveGroup(groupName: string) {
    this.hubConnection.invoke('LeaveGroup', groupName)
      .catch(err => console.error('Error leaving group: ' + err));
  }

  sendMessageToGroup(groupName: string, message: string) {
    this.hubConnection
      .invoke('SendMessageToGroup', groupName, message)
      .catch((err) => {
        console.error('Error sending message: ' + err);
      });
  }

  startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
      })
      .catch((err) => {
        console.error('Error starting SignalR connection: ' + err);
      });
  }
}
