import { Component } from '@angular/core';
import {Page, Loading, Modal, Platform, NavController, NavParams, ViewController,
  Storage, SqlStorage, LocalStorage} from 'ionic-angular';
import {groupBy, ValuesPipe, KeysPipe, textToDate} from '../../pipes/common';
import { CouchDbServices } from '../../providers/couch/couch';
import {DisplayTools} from '../comon/display';
import { RdvPage } from '../rdv/rdv';

declare var PouchDB: any;
/*
  Generated class for the StartPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/start/start.html',
  providers: [CouchDbServices, DisplayTools],
  pipes: [groupBy, ValuesPipe, KeysPipe, textToDate]
})
export class StartPage {
  platform: any;
  srvInfo: any;
  userData: any;
  base: any;
  db: any;
  docs: any;
  params: any;
  display: DisplayTools;
  constructor(public nav: NavController, platform: Platform, display: DisplayTools, private couch: CouchDbServices) {
    this.platform = platform;
    this.display = display;
    this.params = couch.getParams();
    //console.log(this.params);
    this.docs = [];
  }
  ngOnInit() {
    this.couch.verifSession(true).then(response => {
      this.userData = response;
      this.base = this.userData['name'].toLowerCase();
      this.loadBase(this.base);
    }, error => {
      console.error(error);
      this.userData = null;
      this.base = 'demo';
      this.display.displayToast("Veuillez vous identifier ! Mode démo activé");
      this.loadBase(this.base);
    });
  }
  loadBase(base) {
    let loading = this.display.displayLoading("Activation de la base " + base, 1);
    this.db = new PouchDB(base);
    this.docs = []
    this.showBase();
    loading.dismiss();
    /*
    setTimeout(() => {
    }, 2000);
    */
  }
  showBase() {
    let me = this;
    me.docs = [];
    this.db.allDocs({ include_docs: true, descending: true }, function (err, data) {
      me.docs = new groupBy().transform(data.rows, 'doc', 'rdv', 'dateRdv', 10);
    });
  };
  start(item) {
    // start the RDV with data
    console.log("Start RDV with item ", item);
    item['doc']['rdvEnded'] = false;
    this.nav.setRoot(RdvPage, { base: this.base, rdvId: item.id });
  }
}
