import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})
export class WordCalcComponent implements AfterViewInit{
  @ViewChild('calculatorSwitch', { read: ElementRef }) element: ElementRef | undefined;

  plus = 'M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z';
  minus = 'M 0 10 h 24 v 4 h -24 z'

  ngAfterViewInit() {
    if (this.element) {
      this.element.nativeElement.querySelector('.mdc-switch__icon--off').firstChild.setAttribute('d', this.plus);
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', this.minus);
    }
  }
}
