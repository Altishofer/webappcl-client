import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})
export class WordCalcComponent implements AfterViewInit{
  @ViewChild('calculatorSwitch', { read: ElementRef }) element: ElementRef | undefined;

  minus ='M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.2 0 .425.013 .225.013 .575.038-.9.8-1.4 1.975-.5 1.175-.5 2.475 0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.3 0 2.475-.463T20.95 11.15q.025.3 .038.488Q21 11.825 21 12q0 3.75-2.625 6.375T12 21Zm0-1.5q2.725 0 4.75-1.687t2.525-3.963q-.625.275-1.337.412Q17.225 14.4 16.5 14.4q-2.875 0-4.887-2.013T9.6 7.5q0-.6.125-1.287.125-.687.45-1.562-2.45.675-4.062 2.738Q4.5 9.45 4.5 12q0 3.125 2.188 5.313T12 19.5Zm-.1-7.425Z'

  ngAfterViewInit() {
    if (this.element){
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', this.minus);
    }
  }
}
