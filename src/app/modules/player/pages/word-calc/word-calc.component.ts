import { ChangeDetectorRef, Component } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, AbstractControl} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { VectorCalculationModel } from '@data/interfaces/VectorCalculation.model';
import {ActivatedRoute, Router} from "@angular/router";
import {SignalRService} from "@data/services/SignalRService";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {Round} from "@data/interfaces/round.model";

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})

export class WordCalcComponent {
  wordCalcForm: FormGroup;
  wordsArray: FormArray;
  addFieldDisabled : boolean;
  forbiddenWords : string[] = [];
  targetWord : string = '';
  quizId : string = '';
  roundId : string = '';

  round : Round = {
    Id : "",
    QuizId : "",
    RoundTarget : "",
    ForbiddenWords : []
  }

  cal: VectorCalculationModel = {
    Additions: [],
    Subtractions: []
  };

  constructor(
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef,
      private signalRService: SignalRService,
      private router: Router,
      private route: ActivatedRoute,
      private cookieService: CookieService,
      private playerService: PlayerService
  ) {
    this.addFieldDisabled = true;
    this.wordCalcForm = this.fb.group({
      wordsArray: this.fb.array([this.createWordFormGroup()])
    });
    this.wordsArray = this.wordCalcForm.get('wordsArray') as FormArray;
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.roundId = params['roundId'];
    });
    this.getRound();
  }

  getRound(): void {
    this.playerService.getRound(this.roundId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          console.log("REST round: ", response.body);
          this.round = response.body;
          console.log("REST round: ", this.round);
        } else {
          console.log("ERROR: getting round via REST");
        }
      });
  }

  createWordFormGroup(word:string='', isSubtracted:boolean=false): FormGroup {
    return this.fb.group({
      word: word,
      isSubtracted: isSubtracted
    });
  }

  addField(word:string = '', isSubtracted:boolean = false) : void {
    console.log('Before adding field:', this.wordsArray.value);
    this.wordsArray.push(this.createWordFormGroup(word, isSubtracted));
    console.log('After adding field:', this.wordsArray.value);
    this.addFieldDisabled = true;
  }

  allIndexWordNonEmpty():boolean{
    for (let i : number = 0; i < this.wordsArray.length; i++) {
      if (!this.wordsArray.at(i).get('word')?.value) {return false;}
    }
    return true;
  }

  onlyOneField():boolean{
    return this.wordsArray.length === 1;
  }

  removeField(index: number) : void {
    console.log('Before removing field:', this.wordsArray.value);
    this.wordsArray.removeAt(index);
    console.log('After removing field:', this.wordsArray.value);
    this.addFieldDisabled = this.allIndexWordNonEmpty();
  }

  changeSubtract(index: number, event: MatSlideToggleChange) : void {
    this.wordsArray.at(index).get('isSubtracted')?.setValue(event.checked);

    //const wordGroup : AbstractControl<any, any> = this.wordsArray.at(index);
    //if (wordGroup) {
    //  wordGroup.get('isSubtracted')?.setValue(event.checked);
    //  console.log('Changed subtract for index', index, 'to', event.checked);
    //}
  }

  changeWord(index: number, event: Event) : void {
    this.wordsArray.at(index).get('word')?.setValue((event.target as HTMLInputElement).value)
    //const wordGroup : AbstractControl<any, any> = this.wordsArray.at(index);
    //const word : string = (event.target as HTMLInputElement).value;
    //if (wordGroup) {
    //  wordGroup.get('word')?.setValue(word);
    //  console.log('Changed word for index', index, 'to', word);
    //}
    this.addFieldDisabled = this.allIndexWordNonEmpty();
  }

  printArray() {
    this.cal.Additions = [];
    this.cal.Subtractions = [];
    this.wordsArray.value.forEach((word: any) => {
      if (word.isSubtracted) {
        this.cal.Subtractions.push(word.word);
      } else {
        this.cal.Additions.push(word.word);
      }
    });
    console.log('Printed array:', this.cal);
  }
}
