import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate'
import {DisplayTools} from '../../comon/display'
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
  providers: [CalcTools,DisplayTools, SignServices],
})
export class SignaturePage {
  lstSign: any = [];
  srv: any;
  lstForms: any = [];
  lstDocSign: any = [];
  docSign: any = "";
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  dataOut: any = {};
  params: NavParams;
  pageStatus: any;
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private CalcTools: CalcTools,private display:DisplayTools ,private sign: SignServices) {
    this.params = params;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 4;
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.lstForms = [
      { "id": 7, "title": "Vérification des données", "pres": "detail", "status": "" }
    ];
    this.lstDocSign = [
      { "code": "diag", "lib": "Diagnostic Conseil", "refExterne": "", "forms": [1, 2, 3] },
      { "code": "sous", "lib": "Souscription", "refExterne": "", "forms": [1, 2, 3] },
      { "code": "autre", "lib": "Autre", "refExterne": "", "forms": [1, 2, 3] }
    ];
    // Return events from inputs forms
    this.events.subscribe('clientChange', eventData => {
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
      for (var key in this.lstForms) { this.lstForms[key]['status'] = ""; }
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvUpdate', eventData => {
      this.dataIn = eventData[0];
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
  getTemplates() {
    let load=this.display.displayLoading("Chargement des modèles");
    this.sign.callApi(this.srv, "listTemplate").then(response => {
      console.log(response);
      this.lstDocSign = response['envelopeTemplates'];
      load.dismiss();
    }, error => {
      load.dismiss();
      this.display.displayToast("Service de signature NON DISPONIBLE");
      console.log(error);

    })
  }
  startIdNum() {
    console.log("Start call " + this.srv, this.docSign);
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
  close() {
    this.viewCtrl.dismiss();
  }

}
