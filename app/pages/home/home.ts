import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import {DisplayTools} from '../comon/display';
import {StartPage} from '../start/start';
import {SynchroPage} from '../synchro/synchro';
import {DocumentsPage} from '../documents/documents';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [DisplayTools]
})
export class HomePage {
  items: any;
  display: any;
  userData: any;
  constructor(public nav: NavController, private menuCtrl: MenuController, private params: NavParams, display: DisplayTools) {
    this.nav = nav;
    //console.log(params);
    this.userData = params.data;
    this.display = display;
    this.items = [
      { 'title': 'Go !', 'icon': 'rdv.jpg', 'description': "Démarrer un RDV", 'link': StartPage, 'color': this.display.getRandomColor() },
      //{ 'title': 'Découvrir', 'icon': 'regime_retraite_complementaire.jpg', 'description': "Découvrir les offres", 'link': StartPage, 'color': this.display.getRandomColor() },
      { 'title': 'Synchroniser', 'icon': 'sync.jpeg', 'description': "Synchroniser vos données", 'link': SynchroPage, 'color': this.display.getRandomColor() },
      { 'title': 'Documents', 'icon': 'documents.jpg', 'description': "La base documentaire", 'link': DocumentsPage, 'color': this.display.getRandomColor() },
    ];
  }
  ngOnInit() {

  }
  openMenu(evt) {
    console.log("Touch event",evt);
    this.menuCtrl.open();
  }
  openNavDetailsPage(item) {
    this.nav.setRoot(item.link);
  }
}
