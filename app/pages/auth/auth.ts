import { Component } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';
import {Page, Storage, LocalStorage} from 'ionic-angular';
import {FORM_DIRECTIVES} from '@angular/common';
import {CouchDbServices} from '../../providers/couch/couch';
import {HomePage} from '../home/home';


@Component({
  templateUrl: 'build/pages/auth/auth.html',
  directives: [FORM_DIRECTIVES],
  providers: [CouchDbServices]
})
export class AuthPage {
  authType: string = "login";
  user: string;
  isAut: boolean;
  constructor(private nav: NavController, private toastCtrl: ToastController ,private couch: CouchDbServices, private events:Events) {
    //this.couch.closeSession();
    this.couch.verifSession(true).then(response => {
      this.isAut = true;
      this.nav.setRoot(HomePage, response);
    }, error => {
      console.log(error);
      this.isAut = false;
    });
  }
  login(credentials) {
    //console.log(credentials);
    this.couch.openSession(credentials, null).then(response => {
      //console.log(response);
      if (response['ok']) {
        console.log("User Auth validated");
        this.couch.verifSession(true).then(response => {
          this.isAut = true;
          this.events.publish('userChange', response);
          this.nav.setRoot(HomePage, response);
        }, error => {
          console.log(error);
          this.isAut = false;
          let toast = this.toastCtrl.create({
            message: 'Connexion impossible. Erreur technique.',
            duration: 3000
          });
          toast.present();
        });
      } else {
        console.log("Password not valid");
        let toast = this.toastCtrl.create({
          message: 'Utilisateur / mot de passe invalide !',
          duration: 3000
        });
        toast.present();
      }
    }, error => {
      console.log(error);
      let toast = this.toastCtrl.create({
        message: 'Utilisateur / mot de passe invalide !',
        duration: 3000
      });
      toast.present();
    })
  }

  signup(credentials) {
    console.log(credentials);
    this.couch.putUser(credentials, null).then(response => {
      console.log(response);
      if (credentials.password === response['password']) {
        console.log("User Auth validated");
        this.nav.push(HomePage);
      } else {
        console.log("Password not valid");
      }
    }, error => {
      console.log(error);
    })
  }
  authenticated() {
    return this.isAut;
  }
  restart() {
    this.couch.closeSession();
    this.isAut = false;
    this.authType = "login";
  }
}
