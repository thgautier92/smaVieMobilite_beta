import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events, Modal } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate'
import {FlexInput} from '../../../components/flex-input/flex-input';
import {FlexList} from '../../../components/flex-list/flex-list';

/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/concurrents/concurrents.html',
  directives: [FlexInput, FlexList],
  providers: [CalcTools],
})
export class ConcurrentsPage {
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  dataOut: any = {};
  params: NavParams;
  pageStatus: any;
  lstConccurrents: any;
  constructor(private nav: NavController, params: NavParams, private events: Events, private CalcTools: CalcTools) {
    this.params = params;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 4;
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.lstForms = [
      { "id": 12, "title": "Concurrents", "pres": "list", "status": "" }
    ];

    // Return events from inputs forms
    this.events.subscribe('clientChange', eventData => {
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
      for (var key in this.lstForms) { this.lstForms[key]['status'] = ""; }
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvUpdate', eventData => {
      //console.log("Update page conccurents with data", eventData);
      this.dataIn = eventData[0];
    });
    this.events.subscribe('rdvStatus_' + this.idPage, dataReturn => {
      ////console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] === idForm);
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
  }

}
