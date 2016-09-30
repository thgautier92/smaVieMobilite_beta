import { Component, ViewChild, ElementRef, Input, Output, AfterViewInit, OnChanges} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
declare var JSONFormatter: any;
/*
  Generated class for the Record component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'record',
  templateUrl: 'build/components/record/record.html',
  inputs: ['dataRecord'],
  outputs: [],
  directives: [IONIC_DIRECTIVES]
})

export class Record implements AfterViewInit,OnChanges {
  checkColor: any;
  resultDiv: HTMLDivElement;
  @ViewChild('result') result: ElementRef;
  @Input() dataRecord: any;
  formatter:any;
  levelOpen:number=3;
  data:any;
  constructor() {
    this.checkColor = 'transparent';
  }
  ngAfterViewInit() {
    this.resultDiv = this.result.nativeElement;
  }
  ngOnChanges(changes: any) {
    //console.log(changes);
    this.data=changes['dataRecord'].currentValue;
    this.render(this.data,this.levelOpen);
  }
  levelChange(){
    this.render(this.data,this.levelOpen);
  }
  render(data,level) {
    try {
      this.formatter = new JSONFormatter(data,level);
      this.resultDiv.innerHTML = '';
      this.resultDiv.appendChild(this.formatter.render());
      this.checkColor = 'transparent';
    } catch (e) {
      console.log("Erreur JSONFormatter",e);
      this.checkColor = 'rgba(197, 69, 110, 0.30)';
    }
  }
}
