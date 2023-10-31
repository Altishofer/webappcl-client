import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuizService} from "@data/services/quiz.service";
import {Router} from "@angular/router";
import {Round} from "@data/interfaces/round.model";
import {AbstractControl, FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";

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

  wordCalcForm: FormGroup;
  //wordsArray: FormArray;

  @Input() selectedQuizId: number = 0;
  @Input() selectedQuizTitle: string = '';
  @Input() selectedQuizRounds: Round[] = [];

  @Output() previewClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() startQuiz: EventEmitter<number> = new EventEmitter<number>();
  @Output() changesSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
      private fb: FormBuilder,
      private _quizService: QuizService,
      private _router: Router
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

  onInputClick() {
    console.log('Input field was clicked');
  }


  ngOnInit() {
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
    console.log('addField for round: ', roundId);
    const formArray: FormArray<any> = this.wordCalcForm.get(roundId) as FormArray;
    if (formArray){
      formArray.push(this.createWordFormGroup(word, isSubtracted));
    }
    this.addFieldDisabled = true;
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

  removeField(roundId : string, index: number) : void {
    console.log('deleteForbiddenWord', roundId, index);
    const formArray: FormArray<any> = this.wordCalcForm.get(roundId) as FormArray;
    if (formArray){
      const control: AbstractControl<any, any> = formArray.at(index);
        if (control) {
          formArray.removeAt(index);
        }
      }
    this.addFieldDisabled = this.allIndexWordNonEmpty(roundId);
  }

  changeForbiddenWord(roundId:string, index: number, event: Event) : void {
    console.log('changeForbiddenWord', roundId, index, event);
    const formArray: FormArray<any> = this.wordCalcForm.get(roundId) as FormArray;
    if (formArray && event.target){
      const control: AbstractControl<any, any> = formArray.at(index);
      if (control) {
        control.get('word')?.setValue((event.target as HTMLInputElement).value);
      }
    }
  }

  assignValues(){
    this.selectedQuizRounds.forEach((round: Round) => {
      round.forbiddenWords = this.wordCalcForm.get(round.id)?.value.map((wordGroup: AbstractControl<any, any>) => {
        return wordGroup.get('word')?.value;
      });
    });
    // this.selectedQuizRounds.find(r => r.quizId = quizId)?.forbiddenWords.splice(index);
    // this.selectedQuizRounds.find(r => r.quizId = quizId)?.forbiddenWords.splice(index);
  }

  start() : void {
    this.startQuiz.emit(this.selectedQuizId);
  }

  closePreview(): void {
    this.previewClosed.emit(true);
  }

  saveChanges(): void {
    this.changesSaved.emit(true);
  }
}
