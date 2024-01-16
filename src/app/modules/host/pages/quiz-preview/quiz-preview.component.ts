import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {QuizService} from "@data/services/quiz.service";
import {Router} from "@angular/router";
import {Round} from "@data/interfaces/round.model";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {QuizWithRound} from "@data/interfaces/QuizWithRound";
import {catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "@layout/delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-quiz-preview',
  templateUrl: './quiz-preview.component.html',
  styleUrls: ['./quiz-preview.component.css']
})
export class QuizPreviewComponent implements OnInit{
  errorMsg : string = '';
  addFieldDisabled : boolean;
  unexpectedErrorMsg : string = "An unexpected error occurred."
  unsavedChanges: boolean = false;

  forbiddenWordsForm: FormGroup;
  targetWordForm: FormGroup;
  tooltipMessage: string = "This word is not valid, please enter a different one."

  @Input() selectedQuizId: number = 0;
  @Input() selectedQuizTitle: string = '';
  @Input() selectedQuizRounds: Round[] = [];
  @Input() selectedHostId: number = 0;

  @Output() previewClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() startQuiz: EventEmitter<number> = new EventEmitter<number>();

  constructor(
      private fb: FormBuilder,
      private _quizService: QuizService,
      private _dialog: MatDialog
  ) {
    this.addFieldDisabled = true;
    this.forbiddenWordsForm = this.fb.group({});
    this.targetWordForm = this.fb.group({});
  }

  createWordFormGroup(word: string = '', isValidated: boolean = true): FormGroup {
    const wordControl = new FormControl(word, [Validators.minLength(1), Validators.pattern(/^(\S){1,20}$/)]);
    const isValidatedControl = new FormControl(isValidated);

    wordControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((newWord) => {
        if (!(newWord && newWord.length > 0)) {
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
      isValidated: isValidatedControl
    });
  }

  ngOnInit() {
    this.selectedQuizRounds.forEach((round: Round) => {
      let lst: AbstractControl<any, any>[] = [];
      round.forbiddenWords.forEach((forbiddenWord: string) => {
        lst.push(this.createWordFormGroup(forbiddenWord, true));
      });
      this.forbiddenWordsForm.addControl(round.id, this.fb.array(lst));
      this.targetWordForm.addControl(round.id, this.createWordFormGroup(round.roundTarget, true));
    });
  }

  addField(roundId:string, word:string = '', isValidated:boolean = true) : void {
    const formArray: FormArray<any> = this.forbiddenWordsForm.get(roundId) as FormArray;
    if (formArray){
      formArray.push(this.createWordFormGroup(word, isValidated));
    }
    this.addFieldDisabled = true;
  }

  allIndexWordNonEmpty(roundId: string): boolean {
    const formArray: FormArray<any> = this.forbiddenWordsForm.get(roundId) as FormArray;
    if (formArray) {
      for (let i: number = 0; i < formArray.value.length; i++) {
        let word: string = '';
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

  onlyOneRound():boolean{
    return this.selectedQuizRounds.length === 1;
  }

  onlyOneField(quizId : string):boolean{
    return this.forbiddenWordsForm.get(quizId)?.value.length === 1;
  }

  getControls(roundId: string) {
    return (<FormArray>this.forbiddenWordsForm.get(roundId)).controls;
  }

  invalidForbiddenWordInput(roundId: string, index : number) : boolean {
    return (<FormArray>this.forbiddenWordsForm.get(roundId)).controls?.at(index)?.get('isValidated')?.value == false;
  }

  invalidTargetInput(roundId: string) : boolean {
    return this.targetWordForm.get(roundId)?.get('isValidated')?.value == false;
  }

  removeField(roundId : string, index: number) : void {
    const formArray: FormArray<any> = this.forbiddenWordsForm.get(roundId) as FormArray;
    if (formArray){
      const control: AbstractControl<any, any> = formArray.at(index);
        if (control) {
          formArray.removeAt(index);
        }
      }
    this.addFieldDisabled = this.allIndexWordNonEmpty(roundId);
  }

  changes() : void {
    this.unsavedChanges = true;
  }

  addNewRound(){
    let lstForbWordControl: AbstractControl<any, any>[] = [];
    lstForbWordControl.push(this.createWordFormGroup('', false));
    let maxId :number = Math.max.apply(null, Object.keys(this.targetWordForm.controls).map(x => parseInt(x)));
    maxId = Number.isFinite(maxId) ? maxId : -1;
    this.forbiddenWordsForm.addControl(String(maxId+1), this.fb.array(lstForbWordControl));
    this.targetWordForm.addControl(String(maxId+1), this.createWordFormGroup());

    let round : Round = {id : String(maxId+1), quizId : String(this.selectedQuizId), roundTarget : '', forbiddenWords : ['']};
    this.selectedQuizRounds.push(round);
  }

  removeRound(roundId: string) {
    this.forbiddenWordsForm.removeControl(roundId);
    this.targetWordForm.removeControl(roundId);
    this.selectedQuizRounds.splice(this.selectedQuizRounds.findIndex((round: Round) => round.id == roundId), 1);
  }

  trackByFn(index: any, item: any) {
    return item;
  }

  async start(): Promise<void> {
    try {
      this.selectedQuizId = await this.saveChanges();
      this.startQuiz.emit(this.selectedQuizId);
    } catch (error) {
      console.error('An error occurred while saving changes:', error);
    }
  }

  roundAllOk(roundId : string): boolean {
    let allGood : boolean = true;
    let formArray : FormArray = this.forbiddenWordsForm.get(roundId) as FormArray;
    formArray.controls.forEach((control: AbstractControl<any, any>): void | boolean => {
      if (control.get('isValidated')?.value == false || control.get('word')?.value.length == 0) {
        allGood = false;
      }
      });
    let targetArray: FormArray<any> = this.targetWordForm.get(roundId) as FormArray;
    return allGood && !(targetArray.get('isValidated')?.value == false || targetArray.get('word')?.value.length == 0);
  }

  canSaveOrStart() : boolean {
    let allGood : boolean = true;
    this.selectedQuizRounds.forEach((round: Round) : boolean | void => {

      let formArray: FormArray<any> = this.forbiddenWordsForm.get(round.id.toString()) as FormArray;
      formArray.controls.forEach((control: AbstractControl<any, any>): void | boolean => {
        if (control.get('isValidated')?.value == false || control.get('word')?.value.length == 0) {
          allGood = false;
        }
      });

      let targetArray: FormArray<any> = this.targetWordForm.get(round.id.toString()) as FormArray;
      if (targetArray.get('isValidated')?.value == false || targetArray.get('word')?.value.length == 0) {
        allGood = false;
      }
    });
    return allGood;
  }

  closePreview(): void {
    this.previewClosed.emit(true);
  }


  async saveChanges(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.selectedQuizRounds.forEach((round: Round) => {
        let formArray = this.forbiddenWordsForm.get(round.id.toString()) as FormArray;
        round.forbiddenWords = formArray.controls.map(control => control.value.word);
        formArray = this.targetWordForm.get(round.id.toString()) as FormArray;
        round.roundTarget = formArray.value.word;
      });

      let quiz: QuizWithRound = {
        quizId: this.selectedQuizId,
        hostId: this.selectedHostId,
        title: this.selectedQuizTitle,
        rounds: this.selectedQuizRounds,
      };

      let saveChangesObservable: Observable<any>;

      if (this.selectedQuizId == -1) {
        saveChangesObservable = this._quizService.createQuiz(quiz);
      } else {
        saveChangesObservable = this._quizService.updateQuiz(quiz);
      }

      saveChangesObservable
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.log(JSON.stringify(error.error));
            if (error.status != 500) {
              this.errorMsg = error.error;
            } else {
              this.errorMsg = this.unexpectedErrorMsg;
            }
            reject(error);
            return [];
          })
        )
        .subscribe(
          (response: any): void => {
            if ((response.status >= 200 && response.status < 300) || response.status == 304) {
              this.selectedQuizRounds = response.body.rounds;
              this.selectedQuizId = response.body.quizId;
              this.unsavedChanges = false;
              //this.closePreview.emit(true);
              this.closePreview();
              resolve(response.body.quizId);
            } else {
              this.errorMsg = this.unexpectedErrorMsg;
              reject('Unexpected response status');
            }
          },
          (error : any) => {
            console.error('An error occurred while saving changes:', error);
            reject(error);
          }
        );
    });
  }


  saveTitle(event: any) {
    const title = event.target?.textContent;
    if (title) {
      this.selectedQuizTitle = title;
    } else {
      this.selectedQuizTitle = 'Edit Title';
      event.target.textContent = this.selectedQuizTitle;
    }
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(DeleteDialogComponent, {
      data: {
        id : this.selectedQuizId,
        hostId : this.selectedHostId,
        title : this.selectedQuizTitle
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.closePreview();
      }
    });
  }
}
