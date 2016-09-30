import { Component, Input} from '@angular/core';
import { Page, NavController, NavParams, Events, ModalController, ViewController } from 'ionic-angular';
import {DisplayTools} from '../../comon/display';
import {CalcTools} from '../../comon/calculate';
import {FlexInput} from '../../../components/flex-input/flex-input';
import {Simu} from '../../../providers/simu/simu';

import {ValuesPipe, maxByKeyPipe} from '../../../pipes/common';

/*
  Generated class for the DiagConseilPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/simuler/simuler.html',
  directives: [FlexInput],
  providers: [DisplayTools, CalcTools, Simu],
  pipes: [ValuesPipe, maxByKeyPipe]
})
export class SimulerPage {
  lstForms: any = [];
  dataIn: any = {};
  idPage: any = {};
  idClient: any = "";
  refSimu: any = [];          // Reference of avaible simulator tools
  selSimu: any = "";          // model for simulator selected
  lstSimulation: any;         // list of simulation
  histoSimu: any = [];        // history of simulagtion, stored on rdv
  maxSimuId: any;              // Max id of simulation
  idSimu: any = "";           // id of the current simulation
  idSimuExternal: any = "";   // EXTERNAL id of the current simulation
  dataSimu: any = {};         // data returned by simulator
  simuExec: boolean = false;  // flag for exec simulation
  simulatorData: any = []        // Data from EXTERNAL SIMULATOR
  popupWindow: any = null;    // windows object, open for simulation
  params: NavParams;
  pageStatus: any;

  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private events: Events, private display: DisplayTools, private CalcTools: CalcTools, private simu: Simu) {
    this.params = params;
    this.popupWindow = null;
    //this.idPage = this.params.data['currentPage'];
    this.idPage = 3
    this.idClient = this.params.data['currentCli'];
    this.dataIn = this.params.data['currentDoc'];
    this.lstForms = [
    ];
    this.refSimu = [
      { "code": "v1", "lib": "Opticap", "img": "regime_retraite_complementaire.jpg", "url": "http://opticap.smabtp.harvest.fr/opc/" },
      { "code": "v2", "lib": "E-Futuris - Diagnostic Retraite", "img": "th-310x139-2ip_batiretraite_perp.jpg", "url": "" },
      { "code": "v3", "lib": "E-Succession", "img": "succession.jpg", "url": "" },
      { "code": "epicaste", "lib": "Epicaste", "img": "th-310x139-2ip_batiplacement_multicompte_pea_2.jpg", "url": "" },
      { "code": "demo", "lib": "Démonstration", "img": "ionic.png", "url": "" }
    ]
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
      console.log("Update status form", this.lstForms, dataReturn);
      let idForm = dataReturn[0]['form']['id'];
      let f = this.lstForms.filter(item => item['id'] === idForm);
      f[0]['status'] = dataReturn[0]['status'];
      CalcTools.calcPageStatus(this.idPage, this.lstForms);
    });
    this.events.subscribe('rdvSave', eventData => {
      //console.log("Data saved", eventData);
      if (this.popupWindow) this.popupWindow.close();
    });

  }
  ngOnInit() {
    this.lstSimulation = [];
    for (let s of this.refSimu) {
      this.lstSimulation[s.code] = [];
    }
    this.getHistoSimu();
  }
  close() {
    this.viewCtrl.dismiss();
    //save data to local base
  }
  // ===== Manage SIMULATION =====
  getHistoSimu() {
    this.histoSimu = this.dataIn['rdv']['resultByClient'][this.idClient]['simus'];
    this.maxSimuId = new maxByKeyPipe().transform(this.histoSimu, "idSimu");
    console.log(this.dataIn, this.maxSimuId);
  }
  getSimuList(simulator) {
    switch (simulator) {
      case 'epicaste':
        let l = this.simu.epicastGetSimu();
        for (let e of l) {
          this.maxSimuId++;
          e['simulateur'] = simulator;
          this.dataIn['rdv']['resultByClient'][this.idClient]['simus'].push(e);
        }
        break;
      case 'demo':
        break;
      default:
    }
    this.getHistoSimu();
  }
  addSimu(simulator) {
    console.log(simulator);
    this.maxSimuId++;
    this.idSimu = this.maxSimuId;
    let prod = this.refSimu.filter(item => item.code === simulator);
    let e = { "idSimu": this.idSimu, "simulateur": simulator, "produit": prod[0]['lib'], "dateSimu": new Date(), "idExternal": "", "dataSimu": {} }
    this.startSimu(this.maxSimuId, simulator).then(response => {
      this.dataIn['rdv']['resultByClient'][this.idClient]['simus'].push(e);
      this.getHistoSimu();
      this.simuExec = true;
    }, error => {
      console.log(error);
      this.display.displayAlert(error['reason']);
    })

  }
  startSimu(id, simulator) {
    return new Promise((resolve, reject) => {
      // Send data to simulator and get the context url
      let loading = this.display.displayLoading("Envoie des données au simulateur", 5000);
      let rdvId = this.dataIn['rdv']['rdvId'];
      this.simu.callSimulator(simulator, { "rdvId": rdvId, "dataIn": this.dataIn }).then(dataReturn => {
        console.log("Data returned after sendind data", dataReturn);
        loading.dismiss();
        let url = "";
        switch (simulator) {
          case 'epicaste':
            url = "";
            break;
          case 'demo':
            url = dataReturn['urlNext'];
            this.idSimuExternal = dataReturn['insert_id']
            break;
          case 'v1':
            url = dataReturn['urlNext'];
            //url="http://opticap.smabtp.harvest.fr/opc/"
            this.idSimuExternal = dataReturn['insert_id']
            break;
          default:
            url = "";
        }
        // Call the simulator by openning the windows with the url returned
        let options = "location=yes,clearcache=yes,toolbar=yes,width=800,height=600";
        if (this.popupWindow && !this.popupWindow.closed) {
          this.popupWindow.doRefresh();
        } else {
          this.popupWindow = window.open(url, "_blank", options);
          //console.log(this.popupWindow);
        }
        resolve(true);
      }, error => {
        loading.dismiss();
        reject(error);
      });
    });
  }
  getSimu(simulator) {
    let loading = this.display.displayLoading("Reception des données du simulateur", 5000);
    this.simu.getSimulatorById(simulator, this.idSimuExternal).then(response => {
      //console.log("Data simu", response);
      loading.dismiss();
      this.dataIn['rdv']['resultByClient'][this.idClient]['simus'].filter(item => item.idSimu == this.idSimu)[0]['idExternal'] = this.idSimuExternal;

      switch (simulator) {
        case 'epicaste':
          break;
        case 'demo':
          this.dataIn['rdv']['resultByClient'][this.idClient]['simus'].filter(item => item.idSimu == this.idSimu)[0]['dataSimu'] = response;
          break;
        case 'v1':
          this.simulatorData = JSON.parse(response['results']['output'][0]['dataout']);
          this.dataIn['rdv']['resultByClient'][this.idClient]['simus'].filter(item => item.idSimu == this.idSimu)[0]['dataSimu'] = this.simulatorData

          break;
        default:
      }
      // Close the simulator windows
      if (this.popupWindow) this.popupWindow.close();
    }, error => {
      loading.dismiss();
      console.log(error);
      this.display.displayToast(error.reason);
    })
  }
  detailSimu(data) {
    console.log(data);
    let modal = this.modalCtrl.create(SimulerDetail, { "simuData": data });
    modal.present();
  }
  delSimu(idx) {
    this.dataIn['rdv']['resultByClient'][this.idClient]['simus'].splice(idx, 1);
    this.getHistoSimu();
  }
  diagNext(formStatus, evt?) {

    this.events.publish('rdvSave', this.dataIn);
  }
}

// ===== Detail modal =====
@Component({
  templateUrl: 'build/pages/rdv/simuler/simuler-detail.html',
  directives: [],
  pipes: [ValuesPipe],
  providers: []
})
export class SimulerDetail {
  simuData: any;
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private events: Events) {
    console.log(navParams);
    this.simuData = navParams['data']['simuData'];
  }
  close() {
    this.viewCtrl.dismiss();
  }
}