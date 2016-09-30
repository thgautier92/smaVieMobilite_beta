import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, ModalController, Nav, Events} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {InAppBrowser} from 'ionic-native';

import {CouchDbServices} from './providers/couch/couch';

import {HomePage} from './pages/home/home';
import {AuthPage} from './pages/auth/auth';
import {SynchroPage} from './pages/synchro/synchro';
import {SignApiPage} from './pages/sign-api/sign-api';
import {StartPage} from './pages/start/start';
import {DocumentsPage} from './pages/documents/documents';

declare var cordova: any;

@Component({
  templateUrl: 'build/app.html',
  providers: [CouchDbServices]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any, icon: any, color: any }>;
  isAut: boolean = false;
  userData: any = {};

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private modalCtrl: ModalController,
    private couch: CouchDbServices,
    private events: Events
  ) {
    this.initializeApp();
    this.events.subscribe('userChange', eventData => {
      this.userData = eventData[0];
      this.isAut = eventData[0]['ok'];
    });
    // set our app's pages
    this.pages = [
      { title: 'Rendez-vous', component: StartPage, icon: "people", color: "primary" },
      { title: 'Synchronisation', component: SynchroPage, icon: "sync", color: "danger" },
      { title: 'Espace Documentaire', component: DocumentsPage, icon: "albums", color: "action" },
      { title: 'Outil de signature', component: SignApiPage, icon: "bug", color: "secondary" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        StatusBar.styleDefault();
        window.open = cordova.InAppBrowser.open;
      }
    });
  };
  ngOnInit() {
    this.couch.verifSession(true).then(response => {
      this.userData = response;
      this.isAut = true;
      this.nav.setRoot(HomePage, this.userData);
    }, error => {
      console.log("Verif return", error);
      this.isAut = false;
      this.userData = {};
      this.nav.setRoot(AuthPage);
    });
  };
  connect() {
    this.menu.close();
    this.callConnect()
  };
  callConnect() {
    console.log("Call AUTH page");
    let modal = this.modalCtrl.create(AuthPage);
    modal.onDidDismiss(response => {
      console.log("Return from AUTH page", response);
      this.userData = response;
      this.nav.setRoot(HomePage, this.userData);
    })
  }
  disConnect() {
    this.menu.close();
    this.couch.closeSession();
    this.userData = {};
    this.isAut = false;
    this.nav.setRoot(AuthPage);
  };
  goHome() {
    this.menu.close();
    this.nav.setRoot(HomePage, this.userData);
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
ionicBootstrap(MyApp);

