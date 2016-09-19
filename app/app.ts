import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav, Events} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {CouchDbServices} from './providers/couch/couch';
import {HomePage} from './pages/home/home';
import {AuthPage} from './pages/auth/auth';
import {SynchroPage} from './pages/synchro/synchro';
import {SignApiPage} from './pages/sign-api/sign-api';
import {StartPage} from './pages/start/start';
import {DocumentsPage} from './pages/documents/documents';


@Component({
  templateUrl: 'build/app.html',
  providers: [CouchDbServices]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any, icon: any,color:any }>;
  isAut: boolean = false;
  userData: any = {};

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private couch: CouchDbServices,
    private events: Events
  ) {
    this.initializeApp();
    this.events.subscribe('userChange', eventData => {
      console.log(eventData);
      this.userData = eventData[0];
      this.isAut = eventData[0]['ok'];
    });
    // set our app's pages
    this.pages = [
      { title: 'Acceuil', component: HomePage, icon: "home", color:"light" },
       { title: 'Rendez-vous', component: StartPage, icon: "people", color:"primary" },
      { title: 'Synchronisation', component: SynchroPage, icon: "sync", color:"danger" },
      { title: 'Espace Documentaire', component: DocumentsPage, icon: "albums", color:"action" },
      { title: 'Outil de signature', component: SignApiPage, icon: "bug", color:"secondary" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.verif();
    });
  };
  verif() {
    let me = this;
    this.couch.verifSession(true).then(response => {
      me.userData = response;
      me.isAut = true;
      me.nav.setRoot(HomePage, this.userData);
    }, error => {
      console.log(error);
      me.isAut = false;
      me.disConnect();
    });
  };
  connect() {
    this.menu.close();
    this.nav.push(AuthPage);
  };
  disConnect() {
    this.menu.close();
    this.couch.closeSession();
    this.userData = {};
    this.isAut = false;
    this.nav.push(AuthPage);
  };
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
ionicBootstrap(MyApp);

