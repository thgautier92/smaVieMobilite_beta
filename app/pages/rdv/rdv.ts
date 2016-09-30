import { Component, Output, EventEmitter } from '@angular/core';
import { Platform, NavController, ModalController, NavParams, Events, Tabs, MenuController, AlertController } from 'ionic-angular';
import { FORM_DIRECTIVES,
  NgForm, FormBuilder, Control, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {groupBy, ValuesPipe, KeysPipe, textToDate} from '../../pipes/common';
import {CouchDbServices} from '../../providers/couch/couch';
import {Paramsdata} from '../../providers/params-data/params-data';
import {DisplayTools} from '../comon/display';

import {HomePage} from '../home/home';
import {SynthesePage} from './synthese/synthese';
import {DiagConseilPage} from './diag-conseil/diag-conseil';
import {DecouvertePage} from './decouverte/decouverte';
import {PatrimoinePage} from './patrimoine/patrimoine';
import {ProfilRisquePage} from './profil-risque/profil-risque';
import {ConcurrentsPage} from './concurrents/concurrents';
import {SouscriptionPage} from './souscription/souscription';
import {SignaturePage} from './signature/signature';
import {SimulerPage} from './simuler/simuler';
import {OptionCopierPage} from './option-copier/option-copier';
import {OptionPiecesPage} from './option-pieces/option-pieces';
import {StartPage} from '../start/start';

declare var PouchDB: any;
/*
  Generated class for the RdvPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/rdv.html',
  providers: [Paramsdata, CouchDbServices, DisplayTools],
  pipes: [groupBy, ValuesPipe, KeysPipe, textToDate]
})
export class RdvPage {
  db: any;
  base: any;
  refStatus: any = []
  currentRdv: any = {};
  currentCli: any = null;
  titleRdv: any = "";
  currentContext: any;
  lstCli: any = [];
  rdvId: any;
  dataMenu: any;
  rdvMenu: any;
  constructor(private platform: Platform, private nav: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, private navParams: NavParams, public events: Events, private menuOpt: MenuController,
    private display: DisplayTools, private couch: CouchDbServices,
    private paramsApi: Paramsdata, fb: FormBuilder) {
    this.platform = platform;
    this.base = navParams.get("base");
    this.rdvId = navParams.get("rdvId");
    this.db = new PouchDB(this.base);
    this.refStatus = [
      { "code": "hold", "lib": "Attente", "color": "danger" },
      { "code": "partial", "lib": "Partiel", "color": "favorite" },
      { "code": "completed", "lib": "Complet", "color": "secondary" },
    ]
    this.dataMenu = [
      { "id": 1, "status": "hold", "lib": "Synthèse", "icon": "person", "page": SynthesePage },
      { "id": 2, "status": "hold", "lib": "Connaissance Client", "icon": "person", "page": DecouvertePage },
      { "id": 3, "status": "hold", "lib": "Patrimoine", "icon": "home", "page": PatrimoinePage },
      { "id": 4, "status": "hold", "lib": "Concurrents", "icon": "sign", "page": ConcurrentsPage },
    ]
    this.rdvMenu = [
      //{ "id": 1, "lib": "Recopier", "icon": "copy", "page": OptionCopierPage, "nav": "dialog" },
      { "id": 1, "lib": "Informations Client", "icon": "people", "page": null, "nav": "page" },
      { "id": 2, "lib": "Pièces justificatives", "icon": "camera", "page": OptionPiecesPage, "nav": "dialog" },
      { "id": 3, "lib": "Signatures", "icon": "create", "page": SignaturePage, "nav": "page" },
      { "id": 4, "lib": "Simuler", "icon": "calculator", "page": SimulerPage, "nav": "page" },
      //{ "id": 5, "lib": "Vos échanges", "icon": "", "page": "", "nav": "" },
      { "id": 6, "lib": "Diagnostic Conseil", "icon": "compass", "page": DiagConseilPage, "nav": "page" },
      { "id": 7, "lib": "Souscription", "icon": "contract", "page": SouscriptionPage, "nav": "page" },
    ];
    // ===== Events operation on page =====
    events.subscribe('rdvSave', eventData => {
      this.saveData(eventData[0]).then(response => {
        events.publish('rdvUpdate', eventData[0]);
        this.display.displayToast("Données enregistrées.",1)
      }, error => { });
    });
    events.subscribe('menuStatusChange', eventData => {
      //console.log("Update status menu", eventData);
      let idMenu = eventData[0]['id'];
      let m = this.dataMenu.filter(item => item['id'] === idMenu);
      m[0]['status'] = eventData[0]['status'];
    });
    events.subscribe('copyClientChange', eventData => {
      console.log("copyClientChange", eventData);
      this.start(+eventData[0]['id'])
    });
  }
  ngAfterViewInit() {
    this.getRdv(this.rdvId);
  }
  getRdv(id) {
    let me = this;
    this.db.get(id).then(function (rdv) {
      //console.log(doc);
      me.currentRdv = rdv;
      // Create JSON Structure for data input by application
      let idResult = "resultByClient";
      let idDocsInput = "docsInput";
      let idSousInput = "souscription";
      if (typeof me.currentRdv.rdv['status'] === 'undefined') me.currentRdv.rdv['status'] = "En cours";
      if (typeof me.currentRdv.rdv[idDocsInput] === 'undefined') me.currentRdv.rdv[idDocsInput] = [];
      if (typeof me.currentRdv.rdv[idSousInput] === 'undefined') me.currentRdv.rdv[idSousInput] = {};
      if (typeof me.currentRdv.rdv[idResult] === 'undefined') {
        me.currentRdv.rdv[idResult] = [];
        for (var idx in rdv.clients) {
          let cli = rdv.clients[idx]
          me.currentRdv.rdv[idResult].push({
            clientId: cli['client']['output'][0]['REF'],
            clientName: cli['client']['output'][0]['NOM'],
            clientPrenom: cli['client']['output'][0]['PRENOM'],
            etatVie: cli['client']['output'][0]['ETATVIE'],
            forms: [],
            docs: [],
            simus:[],
            rdvStatus: false
          });
        }
      }
      me.lstCli = me.currentRdv.rdv[idResult];
      console.log("Current RDV", me.currentRdv);
      me.start(0);
    }).catch(function (error) {
      console.error(error);
    });
  }
  start(idx) {
    console.log("Select client Index", idx);
    this.titleRdv = this.currentRdv['clients'][idx]['client']['output'][0]['NOM'];
    this.currentCli = idx;
    //this.currentContext = { "currentPage": null, "currentCli": this.currentCli, "currentDoc": this.currentRdv }
    this.currentContext = { "currentCli": this.currentCli, "currentDoc": this.currentRdv }
    console.log("Current Context", this.currentContext);
    this.events.publish('clientChange', this.currentContext);
  }
  retrieveData(idx) {
    //this.currentContext['currentPage'] = idx - 1;
    return this.currentContext;
  }
  // Get the tab style, defined in the refStatus variable
  getStyle(status, field) {
    let r = this.refStatus.filter(item => item['code'] === status);
    return (r.length == 0) ? "ligth" : r[0][field];
  }
  // Save data in PouchDb locally
  saveData(docPut) {
    return new Promise((resolve, reject) => {
      console.log("==> SAVE : RDV is being saved in Pouch : ", docPut);
      let id = docPut['_id'];
      this.db.get(id).then(docLocal => {
        //console.log(docLocal);
        let rev = docLocal['_rev'];
        let up = { _id: id, _rev: rev, clients: docPut['clients'], rdv: docPut['rdv'] };
        this.db.put(up).then(saveResponse => {
          //console.log("<== RDV is saved successfully in Pouch", saveResponse);
          resolve(saveResponse)
        }, saveError => {
          console.log("==> ERROR saving the RDV in Pouch", saveError);
          reject(saveError);
        });
      }, error => {
        console.log(error);
        reject(error);
      })
    });
  };
  rdvEnd() {
    // Verifiy if all tabs are saved
    let okEnd = true;
    let invalid = [];
    for (let m of this.dataMenu) {
      if (m['status'] !== "completed") {
        invalid.push(m['lib']);
        okEnd = false;
      }
    }
    if (okEnd) {
      this.currentRdv.rdv['status'] = "Terminé";
      this.saveData(this.currentRdv);
      this.nav.setRoot(HomePage);
    } else {
      let alert = this.alertCtrl.create({
        title: "Confirmer la fin du RDV",
        message: 'Il reste des onglets non validés.<br>' + invalid.join(",")+"<br>Etes-vous sûr ?",
        buttons: [
          {
            text: 'Annuler', role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: "Valider tel quel",
            handler: () => {
              this.currentRdv.rdv['status'] = "Terminé";
              this.saveData(this.currentRdv);
              this.nav.setRoot(HomePage);
            }
          },
          {
            text: "Confirmer l'abandon ",
            handler: () => {
              this.currentRdv.rdv['status'] = "Abandonné";
              this.saveData(this.currentRdv);
              this.nav.setRoot(HomePage);
            }
          }
        ]
      });
      alert.present();
    }
  }
  // Navigation Menu
  callMenu(item) {
    switch (item['nav']) {
      case "dialog":
        let modal = this.modalCtrl.create(item.page, this.currentContext);
        modal.present();
        break;
      case "page":
        this.nav.push(item.page, this.currentContext);
        break;
      default:
    }
  }
}
