import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate'
import {FlexInput} from '../../../components/flex-input/flex-input';
import {SignServices} from '../../../providers/sign/sign';
/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/signature/signature.html',
  directives: [FlexInput],
  providers: [CalcTools, SignServices],
})
export class SignaturePage {
  lstSign: any = [];
  srv: any;
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  dataOut: any = {};
  params: NavParams;
  pageStatus: any;
  constructor(private nav: NavController, params: NavParams, private events: Events, private CalcTools: CalcTools, private sign: SignServices) {
    this.params = params;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 4;
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.lstForms = [
      { "id": 7, "title":"","pres": "detail", "status": "" }
    ];
    // Return events from inputs forms
    this.events.subscribe('clientChange', eventData => {
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
      for (var key in this.lstForms) { this.lstForms[key]['status'] = ""; }
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvStatus_' + this.idPage, dataReturn => {
      //console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] === idForm);
      console.log("Search Form status", f);
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.srv = "";
    this.sign.getLstParams().then(response => {
      this.lstSign = response;
    })
  }
  startIdNum() {
    console.log("Start call " + this.srv);
    this.sign.callApi(this.srv, "listTemplate").then(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }
  startSign() {
    this.sign.loadRootApi(this.srv).then(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }
  loadDocSign() {

  }
  loadProofSign() {

  }

}
