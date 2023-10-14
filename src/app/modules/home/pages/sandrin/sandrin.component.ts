import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Host } from "@data/interfaces/host.model";
import { environment } from "../../../../../environments/environment";
import { SignalRService } from "../../../../data/services/SignalRService";
import {Observable} from "rxjs";

@Component({
  selector: 'app-sandrin',
  templateUrl: './sandrin.component.html',
  styleUrls: ['./sandrin.component.css'],
})
export class SandrinComponent {
  @ViewChild('inputBox') inputBox!: ElementRef;
  @ViewChild('outputBox') resultBox!: ElementRef;

  private baseUrl = environment.API_URL + "/TodoItems";
  private vectorUrl = environment.API_URL + "/Word2Vector";
  private groupName: string = "0";
  public messages: string[] = [];
  public messageToSend: string = '';
  public similarWords: string[] = [];
  word: string = 'dog';
  count: number = 10;

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.get(`${this.baseUrl}/`, {headers})
      .subscribe(
        (response: any) => {
          console.log('Success: ', response.message);
        },
        (error) => {
          console.error('Error: Failed to get data from baseUrl:', error);
        }
      );
  }

  getSimilarWords(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.get(`${this.vectorUrl}/closestWords/${this.word}/${this.count}`, {headers}).subscribe(
      (similarWords:any) => {
        this.similarWords = similarWords;
      },
      (error) => {
        console.error('Error fetching similar words:', error);
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
