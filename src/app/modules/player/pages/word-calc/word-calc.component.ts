import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { VectorCalculationModel } from '@data/interfaces/VectorCalculation.model';
import { ActivatedRoute, Router } from "@angular/router";
import { SignalRService } from "@data/services/SignalRService";
import { CookieService } from "ngx-cookie-service";
import { PlayerService } from "@data/services/player.service";
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from "rxjs";
import { Answer } from "@data/interfaces/answer.model";
import { HttpErrorResponse } from "@angular/common/http";
import { QuizService } from "@data/services/quiz.service";

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})

export class WordCalcComponent implements OnInit {
  wordCalcForm: FormGroup;
  wordsArray: FormArray;
  addFieldDisabled : boolean;
  quizId : string = '';
  roundId : string = '';
  playerName : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."
  errorMsg : string = '';
  remainingTime = 60;
  submitted : boolean = false;


  cal: VectorCalculationModel = {
    Additions: [],
    Subtractions: []
  };

  answer : Answer = {
    quizId: "",
    roundId: "",
    playerName: "",
    additions: [],
    subtractions: [],
    answerTarget: "",
  };

  constructor(
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef,
      private signalRService: SignalRService,
      private router: Router,
      private route: ActivatedRoute,
      private cookieService: CookieService,
      private playerService: PlayerService,
      private _quizService : QuizService
  ) {
    this.addFieldDisabled = true;
    this.wordCalcForm = this.fb.group({
      wordsArray: this.fb.array([this.createWordFormGroup()])
    });
    this.wordsArray = this.wordCalcForm.get('wordsArray') as FormArray;
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.roundId = params['roundId'];
      this.playerName = params['playerName'];
    });
    this.signalRService.startConnection().then(() => {
      this.registerToGroup();
      this.registerListeners();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
  }

  ngOnInit(): void {
    this.startTimer();
  }

  registerListeners(): void {
    this.signalRService.setReceiveNavigateListener((round: string) => {
      this.submit();
    });
  }

  registerToGroup() {
    this.signalRService.joinGroup(this.quizId);
  }

  startTimer() {
    if (this.remainingTime > 0) {
      setTimeout(() => {
        this.remainingTime -= 1;
        this.cdr.detectChanges();
        this.startTimer();
      }, 1000);
    } else if (!this.submitted) {
      this.submit();
    }
  }


  createWordFormGroup(word:string='', isSubtracted:boolean=false, isValidated:boolean=true): FormGroup {

    const wordControl = new FormControl(word, [Validators.minLength(1), Validators.pattern(/^(\S){1,20}$/)]);
    const isValidatedControl = new FormControl(isValidated);
    const isSubtractedControl : FormControl<boolean | null> = new FormControl(isSubtracted);

    wordControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((newWord) => {
        if (!(newWord && newWord.length > 0) || newWord.includes(" ")) {
          return of(false);
        }
        return this._quizService.Check(newWord);
      }),
      tap((isValid) => {
        wordControl.setErrors(null);
        isValidatedControl.setValue(isValid);
      })
    ).subscribe();
    wordControl.updateValueAndValidity();
    return this.fb.group({
      word: wordControl,
      isValidated: isValidatedControl,
      isSubtracted: isSubtractedControl
    });
  }

  addField(word:string = '', isSubtracted:boolean = false, isValidated:boolean = true) : void {
    this.wordsArray.push(this.createWordFormGroup(word, isSubtracted, isValidated));
    this.addFieldDisabled = true;
  }

  invalidInput(index : number) : boolean{
    return this.wordsArray.at(index).get('isValidated')?.value == false;
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
    this.wordsArray.removeAt(index);
    this.addFieldDisabled = this.allIndexWordNonEmpty();
  }

  changeSubtract(index: number, event: Event) : void {
    this.wordsArray.at(index).get('isSubtracted')?.setValue((event.target as HTMLInputElement).value);

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
      if (word.isSubtracted && word.word) {
        this.cal.Subtractions.push(word.word);
      } else if (!word.isSubtracted && word.word){
        this.cal.Additions.push(word.word);
      }
    });
  }

  submit() : void {
    try{
      if (!this.submitted){
        this.assignValues();
        this.sendAnswer();
      }
    } catch {
      this.errorMsg = this.unexpectedErrorMsg;
    } finally {
      this.switchToRanking();
    }
  }

  sendAnswer(): void{
    console.log("token", this.cookieService.get("playerToken"));
    this.errorMsg = '';
    this.playerService.sendAnswer(this.answer).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status != 500) {
          this.errorMsg = error.error;
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
        return[];
      })
    ).subscribe((response: any): void => {
    if ((response.status >= 200 && response.status < 300) || response.status == 304) {
      this.submitted = true;
    } else {
      this.errorMsg = response.error;
    }
  });
  }

  assignValues(){
    this.answer.roundId = this.roundId;
    this.answer.playerName = this.playerName
    this.answer.quizId = this.quizId;
    this.answer.additions = [];
    this.answer.subtractions = [];
    this.wordsArray.value.forEach((word: any) => {
      if (word.isSubtracted && word.word) {
        this.answer.subtractions.push(word.word);
      } else if (!word.isSubtracted && word.word){
        this.answer.additions.push(word.word);
      }
    });
  }

  switchToRanking(): void {
    this.router.navigate(['/player', 'ranking', this.quizId, this.roundId, this.playerName]);
  }
}
