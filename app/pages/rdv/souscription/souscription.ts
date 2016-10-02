import { Component, Input} from '@angular/core';
import { Page, NavController, ViewController, NavParams, ModalController, Events } from 'ionic-angular';
import {CalcTools} from '../../comon/calculate';
import {DisplayTools} from '../../comon/display';
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
  providers: [CalcTools, DisplayTools, Paramsdata],
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
  // Variable for PRO segment
  histoSimu: any;
  lstProduit: any;
  produit: any = { "code": "", "fiscalite": "" };
  selProduit: any = null;
  lstFiscalite: any = [];
  ficalite: any = "";
  // Variable for REP segment
  lstSupports: any = [];
  supportData: any = [];
  // Variable for ARB segment
  lstArbitrage: any = [];
  arbitrageData: any = [];
  supportArbitrageData: any = [];
  refPeriodicite: any;
  // Variable for REL segment
  relData: any = [];
  // Variable for BEN segment
  refClauses: any = [];
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private modal: ModalController, private events: Events, private CalcTools: CalcTools, private paramsApi: Paramsdata, private display: DisplayTools) {
    this.params = params;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 7
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.dataOut = {};
    this.lstForms = [
      { "id": 11, "title": "", "pres": "detail", "status": "", "spage": "pro" },
      { "id": 20, "title": "", "pres": "detail", "status": "", "spage": "ver" },
      { "id": 21, "title": "", "pres": "detail", "status": "", "spage": "ver" }
    ];
    this.lstEtapes = [
      { "code": "pro", "lib": "Produit" },
      { "code": "ver", "lib": "Versement" },
      { "code": "rep", "lib": "Répartitions" },
      { "code": "arb", "lib": "Arbitrage" },
      { "code": "cp", "lib": "Réservé Conseiller" },
      { "code": "rel", "lib": "Relations" },
      { "code": "ben", "lib": "Bénéficiaires" },
      { "code": "pj", "lib": "PJ" }
    ]
    this.lstArbitrage = [
      { "code": "AC", "lib": "A contrario", "data": { "duree": 0 } },
      { "code": "GH", "lib": "Gestion Horizon", "data": { "duree": 0 } },
      { "code": "VI", "lib": "Visia", "data": { "part_BAI": 0, "PBEE": 0 } },
      { "code": "IP", "lib": "Investissement progressif", "data": { "montant": 0, "duree": 0, "periodicite": "", "supports": [] } },
    ]
    // load referentiels
    this.paramsApi.loadRefs('produits').then(response => { this.lstProduit = response['data']; }, error => { console.log(error); });
    this.paramsApi.loadRefs('supports').then(response => { this.lstSupports = response['data']; }, error => { console.log(error); });
    this.paramsApi.loadRefs('periodicite').then(response => { this.refPeriodicite = response['data']; }, error => { console.log(error); });
    this.paramsApi.loadRefs('clauses').then(response => { this.refClauses = response['data']; }, error => { console.log(error); });
    this.etape = "pro";

    // Return events from inputs forms
    this.events.subscribe('clientChange', eventData => {
      this.idClient = eventData[0]['currentCli'];
      this.dataIn = eventData[0]['currentDoc'];
      for (var key in this.lstForms) { this.lstForms[key]['status'] = ""; }
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('form_update', eventData => {
      console.log(eventData);
      let idForm = eventData[0]['idForm'];
      let spage = this.lstForms.filter(item => item['id'] == idForm)[0]['spage'];
      this.dataIn['rdv']['souscription'][spage][idForm] = eventData[0]['dataForm'];
    });
    this.events.subscribe('rdvUpdate', eventData => {
      this.dataIn = eventData[0];
    });
    /* Not Use
    this.events.subscribe('rdvStatus_' + this.idPage, dataReturn => {
      console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] == idForm);
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    */

  }
  ngOnInit() {
    this.getHistoSimu();
    for (let e of this.lstEtapes) {
      if (typeof this.dataIn['rdv']['souscription'][e.code] === 'undefined') {
        this.dataIn['rdv']['souscription'][e.code] = {};
      }
    }
  }
  doChange(evt) {
    console.log("Change segment", evt);
    this.events.publish('rdvSave', this.dataIn);
  }
  close() {
    this.viewCtrl.dismiss();
  }
  // General Event by form

  // Methods for the PRO segment
  getHistoSimu() {
    this.histoSimu = this.dataIn['rdv']['resultByClient'][this.idClient]['simus'];
  }
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
  addSupport() {
    this.supportData.push({ "support": "", "part": 0 });
  }
  removeSupport(idx) {
    this.supportData.splice(idx, 1);
  }
  updateSupport(data?) {
    // Validate the percent sum    
    let s = 0, p = 0;
    this.supportData.forEach(element => {
      p = +element['part'];
      s = s + p;
    });
    if (s != 100) {
      this.display.displayAlert("La somme des répartitions en UC doit être égale à 100%.");
    } else {
      this.dataIn['rdv']['souscription']['rep'] = this.supportData;
    }
  }
  // Methods for the ARB segment
  addArbitrage() {
    this.arbitrageData = this.lstArbitrage;
  }
  removeArbitrage(idx) {
    this.arbitrageData.splice(idx, 1);
  }
  updateArbitrage() {
    this.dataIn['rdv']['souscription']['arb'] = this.arbitrageData;
  }
  // Method for IP Support
  addArbitrageSupport(source) {
    console.log("Source", source);
    this.supportArbitrageData.push({ "support": "", "part": 0 });
  }
  removeArbitrageSupport(idx) {
    this.supportArbitrageData.splice(idx, 1);
    this.updateArbitrage();
  }
  updateArbitrageSupport(idx) {
    // Validate the percent sum    
    let s = 0, p = 0;
    this.supportArbitrageData.forEach(element => {
      p = +element['part'];
      s = s + p;
    });
    if (s != 100) {
      this.display.displayAlert("La somme des répartitions en UC doit être égale à 100%.");
    } else {
      console.log(this.arbitrageData, this.supportArbitrageData, idx);
      this.arbitrageData[idx]['data']['supports'] = this.supportArbitrageData;
      this.updateArbitrage();
    }
  }
  // Methods for the CP segment
  // Methods for the REL segment
  initREL() {
    this.relData = [];
    this.dataIn.clients.forEach(element => {
      console.log(element);
      this.relData.push({
        "clientId": element.client.output[0].REF,
        "name": element.client.output[0].NOM,
        "roles": [
          { "code": "adh", "lib": "Adhérent", "selRole": false, dataRole: {} },
          { "code": "coadh", "lib": "Co-Adhérent", "selRole": false, dataRole: {} },
          { "code": "payeur", "lib": "Payeur", "selRole": false, dataRole: { "iban": "", "bic": "" } },
          { "code": "sign", "lib": "Signataire", "selRole": false, dataRole: { "situation": "" } },
        ]
      });
    });
  }
  removeRole(idxCli, idxRole) {
    this.relData[idxCli]['roles'].splice(idxRole, 1);
  }
  // Methods for the BEN segment
  openClause(cl) {
    console.log(cl);
    if (cl['form'] != "") {
      let modal=this.modal.create(ClauseDetailPage,{"idClient":this.idClient,"idForm":cl['form'],"dataIn":this.dataIn});
      modal.present();
    }
  }
  // Methods for the PJ segment
}
@Component({
  templateUrl: 'build/pages/rdv/souscription/clause_detail.html',
  directives: [FlexInput],
  providers: []
})
export class ClauseDetailPage {
  idClient:any;
  idForm: any;
  dataIn:any;
  constructor(private nav: NavController, private navParams: NavParams, private viewCtrl: ViewController) {
    console.log(this.navParams);
    this.idClient=this.navParams.data['idClient'];
    this.idForm = this.navParams.data['idForm'];
    this.dataIn = this.navParams.data['dataIn'];
  }
  close() {
    this.viewCtrl.dismiss();
  }

}

