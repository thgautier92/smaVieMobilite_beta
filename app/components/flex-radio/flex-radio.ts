import { Component, ViewChild, ElementRef, Input, Output, OnInit, OnChanges} from '@angular/core';
import {IONIC_DIRECTIVES, Platform, Events} from 'ionic-angular';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {groupBy, ValuesPipe, KeysPipe} from '../../pipes/common';
import {Paramsdata} from '../../providers/params-data/params-data';
import {Simu} from '../../providers/simu/simu';

/*
  Generated class for the FlexInput component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'flex-radio',
  templateUrl: 'build/components/flex-radio/flex-radio.html',
  inputs: ['form', 'field'],
  directives: [IONIC_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  pipes: [groupBy, ValuesPipe, KeysPipe],
  providers: [Paramsdata, Simu]
})
export class FlexRadio implements OnInit, OnChanges {

  @Input() form: any; 
  @Input() field: any;
  constructor(private platform: Platform, private fb: FormBuilder, private paramsApi: Paramsdata, private simu: Simu, private events: Events) {
  }
  ngOnInit() {
    console.log("==> Data passed to component : ", this.form, this.field);
  };
  ngOnChanges(changes: any) {
  };
}