import { Component } from '@angular/core';
import {Page, Loading, ModalController, Platform, NavController, NavParams, ViewController,
  Storage, SqlStorage, LocalStorage} from 'ionic-angular';
import {Record} from '../../components/record/record';
import {CouchDbServices} from '../../providers/couch/couch';
import {DisplayTools} from '../comon/display';

declare var PouchDB: any;

/*
  Generated class for the SynchroPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/synchro/synchro.html',
  providers: [DisplayTools, CouchDbServices],
  directives: [Record]
})
export class SynchroPage {
  srvInfo: any;
  userData: any;
  db: any;
  remoteCouch: any;
  sync: any = {};
  syncExec: any;
  docs: any;
  detailDoc: any = null;
  params: any;
  constructor(public nav: NavController, private modalCtrl: ModalController, private platform: Platform, private display: DisplayTools, private couch: CouchDbServices) {
    this.display = display;
    this.params = couch.getParams();
    //console.log(this.params);
    this.couch.verifSession(true).then(response => {
      console.log(response);
      this.userData = response;
      this.params['base'] = this.userData['name'].toLowerCase();
      this.loadBase(this.params);
    }, error => {
      console.log(error);
      this.userData = null;
      this.display.displayToast("Veuillez vous identifier ! Mode démo activé");
      this.loadBase(this.params);
    });
    this.docs = [];
  }

  loadBase(params) {
    //console.log(params);
    this.sync = { "start": false, "info": false, "error": false, "stats": false, "timer": false };
    this.display.displayLoading("Activation de la base " + params.base, 1);
    this.db = new PouchDB(params.base);
    this.remoteCouch = 'http://' + this.params.user + ':' + this.params.password + '@' + this.params.srv + '/' + this.params.base;
    this.docs = [];
  };

  showBase() {
    let me = this;
    me.docs = [];
    this.db.allDocs({ include_docs: true, descending: true }, function (err, data) {
      me.docs = data;
      //console.log("==> Refresh list", data);
    });
  };
  // ===== Sync opérations =====
  startSync() {
    console.log("Start Sync");
    let me = this;
    this.sync.start = true;
    this.sync.info = false;
    this.sync.error = false;
    this.sync.stats = false;
    this.sync.timer = false;
    var opts = { live: false, retry: true };
    this.syncExec = PouchDB.sync(this.db, this.remoteCouch, opts)
      .on('change', function (info) {
        // handle change
        me.sync.info = info;
        //me.showBase();
      })
      .on('error', function (err) {
        console.log(err);
        me.sync.error = err
        me.display.displayAlert(err);
      })
      .on('complete', function (info) {
        // handle complete
        console.log("Sync completed : ", info);
        me.sync.stats = info;
        me.sync.start = false;
        me.sync.timer = {
          "pull": (info.pull.end_time - info.pull.start_time),
          "push": (info.push.end_time - info.push.start_time)
        };
        me.showBase();
        me.openModal();

      }).on('paused', function (err) {
        // replication paused (e.g. replication up to date, user went offline)
        me.display.displayToast("Synchronisation en pause");
      }).on('active', function () {
        // replicate resumed (e.g. new changes replicating, user went back online)
        me.display.displayToast("Synchronisation active");
      }).on('denied', function (err) {
        // a document failed to replicate (e.g. due to permissions)
        me.display.displayAlert("Synchronisation refusée");
      });
  };
  cancelSync() {
    this.syncExec.cancel();
    this.sync.start = false;
    console.log("End Sync");
  };
  getSyncDetail() {
    this.openModal();
  }
  getDocId(item) {
    this.detailDoc=item;
  }
    delDb() {
      let me = this;
      this.db.destroy().then(function (response) {
        console.log("Del DB", response);
        me.display.displayToast("Base effacée en local.");
        me.loadBase(me.params);
      }).catch(function (err) {
        console.log(err);
      });
    }
    openModal() {
      let modal = this.modalCtrl.create(statSynchroModal, { infos: this.sync.stats });
      modal.present();
    }
  }
  // ========== Modal for displaying sync results ==========
  @Component({
    templateUrl: "build/pages/synchro/synchro-stats.html"
  })
  class statSynchroModal {
  infos: any;
  constructor(public platform: Platform, public params: NavParams, private viewCtrl: ViewController) {
    this.infos = this.params.get('infos');
  }
  close() {
    this.viewCtrl.dismiss();
  }
}

