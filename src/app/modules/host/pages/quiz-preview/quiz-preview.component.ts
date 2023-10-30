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
    });
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

  addField(quizId:string, word:string = '', isSubtracted:boolean = false) : void {
    this.wordCalcForm.get(quizId)?.value.push(this.createWordFormGroup(word, isSubtracted))
    this.selectedQuizRounds.find(r => r.quizId = quizId)?.forbiddenWords.push(word);
    this.addFieldDisabled = true;
  }

  allIndexWordNonEmpty():boolean{
    //for (let i : number = 0; i < this.wordsArray.length; i++) {
    //  if (!this.wordsArray.at(i).get('word')?.value) {return false;}
    //}
    return true;
  }

  onlyOneField(quizId : string):boolean{
    return this.wordCalcForm.get(quizId)?.value.length === 1;
  }



  removeField(roundId : string, index: string) : void {
    this.wordCalcForm.get(roundId)?.value.splice(index);
    //this.addFieldDisabled = this.allIndexWordNonEmpty();
  }

  changeSubtract(index: number, event: MatSlideToggleChange) : void {
    //this.wordsArray.at(index).get('isSubtracted')?.setValue(event.checked);
  }

  changeTargetWord(quizId : string ,index: number, event: Event) : void {
    console.log('changeTargetWord', quizId, index, event);
    this.wordCalcForm.get(quizId)?.value.at(index).get('word')?.setValue((event.target as HTMLInputElement).value);
    this.selectedQuizRounds.find(r => r.quizId = quizId)?.forbiddenWords.splice(index);
    //this.addFieldDisabled = this.allIndexWordNonEmpty();
  }

  changeForbiddenWord(quizId:string, index: number, event: Event) : void {
    this.wordCalcForm.get(quizId)?.value.at(index).get('word')?.setValue((event.target as HTMLInputElement).value);
    this.selectedQuizRounds.find(r => r.quizId = quizId)?.forbiddenWords.splice(index);
    //this.addFieldDisabled = this.allIndexWordNonEmpty();
  }


  roundsPresent(position: number): boolean {
    return this.allRounds[position].forbiddenWords.length > 0;
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
