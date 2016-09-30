import { Component, Input,ViewChild} from '@angular/core';
import { Page, NavController, NavParams, Events, LoadingController, ViewController } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate'
import {FlexInput} from '../../../components/flex-input/flex-input';

/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/profil-risque/profil-risque.html',
  directives: [FlexInput],
  providers: [CalcTools],
})
export class ProfilRisquePage {
  @ViewChild(FlexInput) dataProfile: FlexInput
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  dataOut: any = {};
  params: NavParams;
  pageStatus: any;
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private CalcTools: CalcTools, private loadingCtrl: LoadingController) {
    this.params = params;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 2
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.lstForms = [
      { "id": 32, "title": "", "pres": "detail", "status": "" }
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
      ////console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] === idForm);
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
  }
  calcProfil() {
    let loader = this.loadingCtrl.create({
      content: "Calcul en cours...",
      duration: 5000
    });
    loader.present();
    // read forms
    let lstValue = [];
    for (let f of this.lstForms) {
      // Read form f['id']
      let idF = f['id'];
      let d = this.dataIn;
    }
    this.dataProfile.diagNext('completed');
    this.events.publish("profilCalculted", 2);
    loader.dismiss();
    this.viewCtrl.dismiss();
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
