import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { VectorCalculationModel } from '@data/interfaces/VectorCalculation.model';

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})

export class WordCalcComponent {
  wordCalcForm: FormGroup;
  wordsArray: FormArray;
  addFieldDisabled : boolean;

  cal: VectorCalculationModel = {
    Additions: [],
    Subtractions: []
  };

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.addFieldDisabled = true;
    this.wordCalcForm = this.fb.group({
      wordsArray: this.fb.array([this.createWordFormGroup()])
    });
    this.wordsArray = this.wordCalcForm.get('wordsArray') as FormArray;
    console.log('Constructor:', this.wordsArray);
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

  lastIndexWordEmpty():boolean{
    const lastIndex : number = this.wordsArray.length-1;
    if (lastIndex === 0) {return false;}
    const lastWord = this.wordsArray.at(lastIndex).get('word')?.value;
    return !lastWord;
  }

  onlyOneField():boolean{
    return this.wordsArray.length === 1;
  }

  removeField(index: number) : void {
    console.log('Before removing field:', this.wordsArray.value);
    this.wordsArray.removeAt(index);
    console.log('After removing field:', this.wordsArray.value);
    this.addFieldDisabled = this.lastIndexWordEmpty();
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
    this.addFieldDisabled = this.lastIndexWordEmpty();
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
