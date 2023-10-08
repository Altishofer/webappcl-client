import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "@data/interfaces/user.model";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-sandrin',
  templateUrl: './sandrin.component.html',
  styleUrls: ['./sandrin.component.css']
})
export class SandrinComponent {
  @ViewChild('inputBox') inputBox!: ElementRef;
  @ViewChild('resultBox') resultBox!: ElementRef;

  public content: string;
  public query: string | undefined;
  public tokens: string[] = [];
  public solution: string[] = [];
  public colTok: string = "";
  public colSol: string = "";
  private baseUrl = environment.API_URL + "/TodoItems";

  public constructor(
      private sanitizer: DomSanitizer,
      private http: HttpClient
  ) {
    this.content = 'Hello! mac "n" cheese Sandrin! TeSt'.trim();
    this.tokens = []; // ['He', '!', 'mac', '"','n','"', 'cheese', 'Sandrin', "!", "TeSt"];
    this.solution = ['Hello', '!', 'mac "n" cheese', "Sandrin", "!", "Te", "St"];
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

  public getColTok():SafeHtml{
    this.dynamicProgramming();
    return this.sanitizer.bypassSecurityTrustHtml(this.colTok);
  }

  public getColSol():SafeHtml{
    this.dynamicProgramming();
    return this.sanitizer.bypassSecurityTrustHtml(this.colSol);
  }

  public handleInputChange() {
    try {
      if (this.query) {
        let modifiedRegexString = this.query.replace(/\(/g, '(?:');
        const regex = new RegExp(`${modifiedRegexString || ''}`, 'g');
        this.tokens = this.content.match(regex) || [];
        console.log(regex);
      }
    } catch (error) {
      this.tokens = [];
    }
    console.log(this.tokens);
  }

  public dynamicProgramming(){
    let ls : string = this.solution.join(";").trim();
    let c : number[] = this.getEncoding(ls);

    let lt : string = this.tokens.join(";").trim();
    let t : number[] = this.getEncoding(lt);

    this.colTok = this.getColorReg(t);
    this.colSol = this.getColorSol(t, c);
  }

  private getEncoding(ls:string) : number[]{
    let c:number[] = [];
    let i:number = 0;
    let j:number = 0;

    for (let x:number = 0; x<this.content.length; x++ ){
      if(ls.charAt(i)!=";" && ls.charAt(i)==this.content.charAt(x)){
        c.push(i>0 && c[j-1]>=0 ? c[j-1]+1: 1)
        i++;
      }
      else if (ls.charAt(i)==";" && this.content.charAt(x)==" "){
        c.push(0);
        i++;
      }
      else if (ls.charAt(i)==";" && x>0 && this.content.charAt(x)!=" " && this.content.charAt(x-1)!=" "){
        c.push(-1);
        i++;
        x--;
      }
      else if(ls.charAt(i)!=";" && ls.charAt(i)!=this.content.charAt(x)){
        c.push(0);
      }
      else {
        c.push(999);
      }
      j++;
    }
    c = c.filter(int => int!=-1);

    return c;
  }

  getSpan(col:string[]): string {
    let html:string[] = []
    for (let i:number=0; i<col.length;i++){
      if (col[i]==null || col[i]==""){
        //html.push((`<span style='background-color: ${"#fff"};'>${this.content[i]}</span>`))
        html.push(this.content[i]);
      }
      else {
        html.push((`<span style='background-color: ${col[i]};'>${this.content[i]}</span>`))
      }
    }
    return html.join("");
  }

  getColorSol(t:number[], s:number[]) : string {
    let colSolA : string = "#ff9d9d";
    let colSolB : string = "#ffbebe";
    let colSolCorA : string = "#5bb65b";
    let colSolCorB : string = "#90EE90";

    let c : string[] = Array(s.length);

    for (let i:number=s.length-1; i>=0; i--){

      if (s[i]==t[i] && (i==s.length-1)){
        c[i] = colSolCorA;
      }
      if (s[i]==t[i] && s[i]!=0 && i<s.length-1 && ((c[i+1]==colSolCorA || c[i+1]==colSolCorB)|| (s[i]>=s[i+1] && t[i]>=t[i+1]))){
        c[i] = colSolCorB;
      }
      else if (s[i]!=t[i] && s[i]!=0 && i<s.length-1 && s[i]>=s[i+1]){
        c[i] = c[i+1]==colSolB ? colSolA : colSolB;
      }
      else if (s[i]!=t[i] && s[i]!=0 && i<s.length-1 && s[i]<s[i+1]){
        c[i] = c[i+1];
      }
      else if (s[i]!=t[i] && s[i]!=0 && i==s.length-1){
        c[i] = colSolA;
      }
      else if (s[i]==t[i] && s[i]!=0 && i<s.length-1 && ((c[i+1]==colSolA || c[i+1]==colSolB)) && t[i+1]!=s[i+1] && s[i+1]<=s[i]){
        c[i] = c[i+1]==colSolB ? colSolA : colSolB;
      }
      else if (s[i]==t[i] && s[i]!=0 && i<s.length-1 && ((c[i+1]==colSolCorA || c[i+1]==colSolB))){
        c[i] = c[i+1];
      }
    }
    return this.getSpan(c);
  }

  getColorReg(s:number[]) : string {
    let colRegA : string = "#ADD8E6";
    let colRegB : string = "#87CEFA";

    let c : string[] = Array(s.length);

    for (let i:number=s.length-1; i>=0; i--){
      if (i==s.length-1 && s[i]>0){
        c[i] = colRegA;
      }
      else if (i<s.length-1 && s[i]>0 && s[i+1]<=s[i]){
        c[i] = c[i+1]==colRegA ? colRegB : colRegA;
      }
      else if (i<s.length-1 && s[i]>0 && s[i+1]>s[i]){
        c[i] = c[i+1];
      }
    }
    return this.getSpan(c);
  }
}
