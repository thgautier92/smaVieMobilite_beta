import { Component, Input} from '@angular/core';
import { Page, NavController, ViewController, NavParams, Events } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate'
import {FlexInput} from '../../../components/flex-input/flex-input';
import {Paramsdata} from '../../../providers/params-data/params-data';

/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/souscription/souscription.html',
  directives: [FlexInput],
  providers: [CalcTools,Paramsdata],
})
export class SouscriptionPage {
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  dataOut: any = {};
  params: NavParams;
  pageStatus: any;
  lstEtapes: any = [];
  etape: any;
  histoSimu: any;
  lstProduit: any;
  produit: any = { "code": "", "fiscalite": "" };
  selProduit: any = null;
  lstFiscalite: any = [];
  ficalite: any = "";
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private CalcTools: CalcTools, private paramsApi: Paramsdata) {
    this.params = params;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 4
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.lstForms = [
      { "id": 11, "title": "", "pres": "detail", "status": "" }
    ];
    this.lstEtapes = [
      { "code": "pro", "lib": "Produit" },
      { "code": "ver", "lib": "Versement" },
      { "code": "rep", "lib": "Répartitions" },
      { "code": "arb", "lib": "Arbitrage" },
      { "code": "cp", "lib": "Conditions Particulières" },
      { "code": "rel", "lib": "Relations" },
      { "code": "ben", "lib": "Bénéficiaires" },
      { "code": "pj", "lib": "PJ" }
    ]
    this.etape = "pro";
    this.paramsApi.loadRefs('produits').then(response => {
      console.log(response);
      this.lstProduit = response['data'];
    }, error => {
      console.log(error);
    })

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
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
  }
  ngOnInit() {
    this.getHistoSimu();
    for (let e of this.lstEtapes) {
      if (typeof this.dataIn['rdv']['souscription'][e.code] === 'undefined') {
        this.dataIn['rdv']['souscription'][e.code] = {};
      }
    }
  }
  getHistoSimu() {
    this.histoSimu = this.dataIn['rdv']['resultByClient'][this.idClient]['simus'];
  }
  doChange(evt) {
    console.log("Change segment", evt);
    this.events.publish('rdvSave', this.dataIn);
  }
  close() {
    this.viewCtrl.dismiss();
  }
  // Methods for the PRO segment
  selSimu(data) {
    this.produit.code = data.code;
    this.dataIn['rdv']['souscription']['pro']['produit'] = this.produit;
    this.selProduit = this.lstProduit.filter(item => item.code === this.produit.code)[0];
  }
  changeProduit(evt) {
    this.selProduit = this.lstProduit.filter(item => item.code === this.produit.code)[0];
    this.dataIn['rdv']['souscription']['pro']['produit'] = this.produit;
  }
  changeFiscalite(evt) {
    this.dataIn['rdv']['souscription']['pro']['produit'] = this.produit;
  }
  // Methods for the VER segment
  // Methods for the REP segment
  // Methods for the ARB segment
  // Methods for the CP segment
  // Methods for the REL segment
  // Methods for the BEN segment
  // Methods for the PF segment



}
