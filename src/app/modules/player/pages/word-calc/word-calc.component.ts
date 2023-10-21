import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, AbstractControl} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { VectorCalculationModel } from '@data/interfaces/VectorCalculation.model';

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})
export class WordCalcComponent implements OnInit {
  wordCalcForm: FormGroup;
  wordsArray: FormArray;

  cal: VectorCalculationModel = {
    Additions: [],
    Subtractions: []
  };

  constructor(private fb: FormBuilder) {
    this.wordCalcForm = this.fb.group({
      wordsArray: this.fb.array([])
    });
    this.wordsArray = this.wordCalcForm.get('wordsArray') as FormArray;
    console.log('Constructor:', this.wordsArray);
  }

  ngOnInit() {
    this.wordCalcForm = this.fb.group({
      wordsArray: this.fb.array([])
    });
    this.wordsArray = this.wordCalcForm.get('wordsArray') as FormArray;
    console.log('OnInit:', this.wordsArray);
  }

  createWordFormGroup(word = 'default', isSubtracted: boolean = false): FormGroup {
    return this.fb.group({
      word: word,
      isSubtracted: isSubtracted
    });
  }

  addField() {
    console.log('Before adding field:', this.wordsArray.value);
    this.wordsArray.push(this.createWordFormGroup());
    console.log('After adding field:', this.wordsArray.value);
  }

  removeField(index: number) {
    console.log('Before removing field:', this.wordsArray.value);
    this.wordsArray.removeAt(index);
    console.log('After removing field:', this.wordsArray.value);
  }

  changeSubtract(index: number, event: MatSlideToggleChange) {
    const wordGroup : AbstractControl<any, any> = this.wordsArray.at(index);
    if (wordGroup) {
      wordGroup.get('isSubtracted')?.setValue(event.checked);
      console.log('Changed subtract for index', index, 'to', event.checked);
    }
  }

  changeWord(index: number, event: Event) {
    const wordGroup : AbstractControl<any, any> = this.wordsArray.at(index);
    if (wordGroup) {
      wordGroup.get('word')?.setValue((event.target as HTMLInputElement).value);
      console.log('Changed word for index', index, 'to', (event.target as HTMLInputElement).value);
    }
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
