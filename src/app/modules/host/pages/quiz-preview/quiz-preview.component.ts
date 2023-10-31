import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {QuizService} from "@data/services/quiz.service";
import {Router} from "@angular/router";
import {Round} from "@data/interfaces/round.model";
import {AbstractControl, FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {QuizWithRound} from "@data/interfaces/QuizWithRound";


@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export class QuizPreviewComponent implements OnInit{
  allRounds: Round[] = [];
  errorMsg : string = '';
  addFieldDisabled : boolean;
  unexpectedErrorMsg : string = "An unexpected error occurred."
  newQuizTitle: string = '';
  unsavedChanges: boolean = false;

  wordCalcForm: FormGroup;
  //wordsArray: FormArray;

  @Input() selectedQuizId: number = 0;
  @Input() selectedQuizTitle: string = '';
  @Input() selectedQuizRounds: Round[] = [];
  @Input() selectedHostId: number = 0;

  @Output() previewClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() startQuiz: EventEmitter<number> = new EventEmitter<number>();
  @Output() changesSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
      private fb: FormBuilder,
      private _quizService: QuizService,
      private _router: Router,
      private cd : ChangeDetectorRef
  ) {
    this.addFieldDisabled = true;
    this.wordCalcForm = this.fb.group({});
  }

  createWordFormGroup(word:string='', isSubtracted:boolean=false): FormGroup {
    return this.fb.group({
      word: word,
      isSubtracted: isSubtracted
    }, {disabled: false, validators: []});
  }

  ngOnInit() {
    if (this.selectedQuizId == -1) {
      this.addNewRound();
      return;
    }
    this.selectedQuizRounds.forEach((round: Round) => {
      let lst: AbstractControl<any, any>[] = [];
      round.forbiddenWords.forEach((forbiddenWord: string) => {
        lst.push(this.createWordFormGroup(forbiddenWord, false));
      });
      this.wordCalcForm.addControl(round.id, this.fb.array(lst));
    });
    console.log('wordCalcForm', this.wordCalcForm.value);
  }

  selectText(event: any) {
    console.log("clicked field");
    if (event.target.tagName.toLowerCase() === 'input') {
      const inputElement = event.target as HTMLInputElement;
      inputElement.select();
    }
  }


  addField(roundId:string, word:string = '', isSubtracted:boolean = false) : void {
    const formArray: FormArray<any> = this.wordCalcForm.get(roundId) as FormArray;
    console.log('AddForbiddenWord_Before', formArray.value);
    if (formArray){
      formArray.push(this.createWordFormGroup(word, isSubtracted));
    }
    this.addFieldDisabled = true;
    console.log('AddForbiddenWord_After', formArray.value);
  }


  allIndexWordNonEmpty(roundId: string): boolean {
    const formArray: FormArray<any> = this.wordCalcForm.get(roundId) as FormArray;
    if (formArray) {
      for (let i: number = 0; i < formArray.value.length; i++) {
        let word: string = 'test';
        const control : AbstractControl<any, any> = formArray.at(i);
        if (control) {
          word = control.get('word')?.value;
        }
        if (!word) {
          return false;
        }
      }
      return true;
    }
    return false;
  }


  onlyOneField(quizId : string):boolean{
    return this.wordCalcForm.get(quizId)?.value.length === 1;
  }

  getControls(roundId: string) {
    return (<FormArray>this.wordCalcForm.get(roundId)).controls;
  }

  removeField(roundId : string, index: number) : void {
    console.log('deleteForbiddenWord', roundId, index);
    const formArray: FormArray<any> = this.wordCalcForm.get(roundId) as FormArray;
    console.log('deleteForbiddenWord', formArray.value);
    if (formArray){
      const control: AbstractControl<any, any> = formArray.at(index);
        if (control) {
          formArray.removeAt(index);
          //formArray.updateValueAndValidity();
        }
      }
    this.addFieldDisabled = this.allIndexWordNonEmpty(roundId);
    //this.cd.detectChanges();
    console.log('RemoveForbiddenWord_After', formArray.value);
  }

  changes() : void {
    this.unsavedChanges = true;
  }

  addNewRound(){
    let lst: AbstractControl<any, any>[] = [];
    lst.push(this.createWordFormGroup('', false));

    let maxId: number = 0;
    this.selectedQuizRounds.forEach((round: Round) => {
      if (Number(round.id) > maxId) {
        maxId = Number(round.id);
      }
    });
    this.wordCalcForm.addControl(String(maxId+1), this.fb.array(lst));
    let round : Round = {id : String(maxId+1), quizId : String(this.selectedQuizId), roundTarget : 'word', forbiddenWords : ['']};
    this.selectedQuizRounds.push(round);
  }

  removeRound(roundId: string) {
    this.wordCalcForm.removeControl(roundId);
    this.selectedQuizRounds.splice(this.selectedQuizRounds.findIndex((round: Round) => round.id === roundId), 1);
  }

  trackByFn(index: any, item: any) {
    return item;
  }

  start() : void {
    this.startQuiz.emit(this.selectedQuizId);
  }

  closePreview(): void {
    this.previewClosed.emit(true);
  }

  saveChanges(): void {
    this.selectedQuizRounds.forEach((round: Round) => {
      let formArray = this.wordCalcForm.get(round.id.toString()) as FormArray;
      round.forbiddenWords = formArray.controls.map(control => control.value.word);
    });
    console.log('Updated selectedQuizRounds', this.selectedQuizRounds);

    let quiz: QuizWithRound = {
      quizId : this.selectedQuizId,
      hostId : this.selectedHostId,
      title : this.selectedQuizTitle,
      rounds : this.selectedQuizRounds
    }

    //quiz = {
    //  quizId : 11,
    //  hostId : 5,
    //  title : 'honolulu',
    //  rounds : [{
    //    "id": "7",
    //    "quizId": "11",
    //    "roundTarget": "dog",
    //    "forbiddenWords": [
    //      "cat",
    //      "mouse",
    //      "bottle"
    //    ]
    //  }]
    //}

    console.log(quiz);
    if (this.selectedQuizId == -1) {
      this._quizService.createQuiz(quiz).subscribe((response: any): void => {
        console.log("REST quiz: ", response.body);
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          this.selectedQuizRounds = response.body.rounds;
          this.selectedQuizId = response.body.quizId;
          location.reload();
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
      });
    } else {
      this._quizService.updateQuiz(quiz).subscribe((response: any): void => {
        console.log("REST quiz: ", response.body);
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          this.selectedQuizRounds = response.body.rounds;
          this.unsavedChanges = false;
          //this.changesSaved.emit(true);
          //this.closePreview();
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
      });
    }
    }

    saveTitle(title: string) {
      if (title){
        this.selectedQuizTitle = title;
      }
    }
}
