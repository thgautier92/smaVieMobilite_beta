import { Component} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import { NavController, ViewController, Events, ToastController } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Page, Storage, LocalStorage} from 'ionic-angular';

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
  isAut: boolean = false;
  loginCreds: any;
  signupCreds: any;
  constructor(private nav: NavController, private viewCtrl: ViewController, private toastCtrl: ToastController, private fb: FormBuilder, private couch: CouchDbServices, private events: Events) {
    //this.couch.closeSession();
  }
  ionViewLoaded() {
    this.loginCreds = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ])]
    });
  }
  ngOnInit() { }
  login(credentials) {
    ////console.log(credentials);
    this.couch.openSession(credentials, null).then(response => {
      ////console.log(response);
      if (response['ok']) {
        //console.log("User Auth validated");
        this.couch.verifSession(true).then(response => {
          this.isAut = true;
          this.events.publish('userChange', response);
          this.nav.setRoot(HomePage, response);
        }, error => {
          //console.log(error);
          this.isAut = false;
          let toast = this.toastCtrl.create({
            message: 'Connexion impossible. Erreur technique.',
            duration: 3000
          });
          toast.present();
        });
      } else {
        //console.log("Password not valid");
        let toast = this.toastCtrl.create({
          message: 'Utilisateur / mot de passe invalide !',
          duration: 3000
        });
        toast.present();
      }
    }, error => {
      //console.log(error);
      let toast = this.toastCtrl.create({
        message: 'Utilisateur / mot de passe invalide !',
        duration: 3000
      });
      toast.present();
    })
  }
  createAccount() {
    this.nav.push(SignUpPage);
  }
  restart() {
    this.couch.closeSession();
    this.isAut = false;
    this.authType = "login";
  }
}

// SIGNUP component
@Component({
  templateUrl: 'build/pages/auth/signup.html',
  directives: [FORM_DIRECTIVES],
  providers: [CouchDbServices]
})
export class SignUpPage {
  signupCreds: any;
  constructor(private nav: NavController, private viewCtrl: ViewController, private toastCtrl: ToastController, private fb: FormBuilder, private couch: CouchDbServices, private events: Events) {
  }
  ionViewLoaded() {
    this.signupCreds = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ])]
    });
  }
  signup(credentials) {
    //console.log(credentials);
    this.couch.putUser(credentials, null).then(response => {
      //console.log("CouchDB response", response);
      if (response['ok'] === true) {
        //console.log("User Auth creation validated");
        let toast = this.toastCtrl.create({
          message: 'Compte crée. Vous pouvez vous connecter.',
          duration: 3000
        });
        toast.present();
        this.nav.pop();
      } else {
        //console.log("Error during creating account");
        let toast = this.toastCtrl.create({
          message: 'Création du compte impossible. Erreur technique.',
          duration: 3000
        });
        toast.present();
      }
    }, error => {
      //console.log(error);
      let toast = this.toastCtrl.create({
        message: 'Connexion impossible. Erreur technique.',
        duration: 3000
      });
      toast.present();
    })
  }
  cancel() {
    this.nav.pop();
  }
}
