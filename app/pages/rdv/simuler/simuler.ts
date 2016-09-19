import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events, Modal, ViewController } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate'
import {FlexInput} from '../../../components/flex-input/flex-input';
import {Simu} from '../../../providers/simu/simu';
import {ValuesPipe} from '../../../pipes/common';

/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/simuler/simuler.html',
  directives: [FlexInput],
  providers: [CalcTools, Simu],
  pipes: [ValuesPipe]
})
export class SimulerPage {
  popupWindow: any;
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  idSimu: any = "";
  dataSimu: any = {};
  params: NavParams;
  pageStatus: any;
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private CalcTools: CalcTools, private simu: Simu) {
    this.params = params;
    this.popupWindow = null;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 3
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataSimu = { "dateSimu": "", "idSimu": "", "data": [] };
    this.lstForms = [
      { "id": 6, "title":"","pres": "detail", "status": "" }
    ];
    // Return events from inputs forms
    this.events.subscribe('clientChange', eventData => {
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
      for (var key in this.lstForms) { this.lstForms[key]['status'] = ""; }
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvStatus_' + this.idPage, dataReturn => {
      console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] === idForm);
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvSave', eventData => {
      //console.log("Data saved", eventData);
      let extra = eventData[0]['rdv']['resultByClient'][this.idClient]['forms'][6]['extraData'];
      if (extra) {
        this.idSimu = extra['idSimu'];
        let d = extra['simu'];
        this.dataSimu = { "idSimu": this.idSimu, "dateSimu": d['datemaj'], "data": JSON.parse(d['dataout']) };
      }
      if (this.popupWindow) this.popupWindow.close();
    });
    this.events.subscribe('simuStart', eventData => {
      //console.log(eventData);
      this.popupWindow = eventData[1];
      this.dataSimu['dateSimu'] = eventData[0]['time_stamp'];
      this.dataSimu['idSimu'] = eventData[0]['insert_id'];
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
