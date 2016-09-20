import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { Page, NavController, NavParams, Events, ModalController, AlertController, IONIC_DIRECTIVES, Platform, ViewController } from 'ionic-angular';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Paramsdata} from '../../../providers/params-data/params-data';
import {groupBy, ValuesPipe, KeysPipe} from '../../../pipes/common';

/*
  Generated class for the OptionPiecesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/option-pieces/option-pieces.html',
  pipes: [groupBy, ValuesPipe, KeysPipe],
  directives: [IONIC_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  providers: [Paramsdata]
})
export class OptionPiecesPage {
  form: any;
  idClient: any;
  dataIn: any;
  lstCible: any = [];
  lstNatureInfo: any;
  lstfields: any = [];
  cible: any = null;
  nature: any = "";
  base64Image: any = "img/camera.jpg";
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private modalCtrl: ModalController, private alertCtrl: AlertController, private events: Events, private menu: Paramsdata) {
    this.idClient = params.data['currentCli'];
    this.dataIn = params.data['currentDoc'];
    this.lstCible = [];
    for (let i in this.dataIn['clients']) {
      console.log(i, this.dataIn['clients'][i]);
      this.lstCible.push({ "id": i, "name": this.dataIn['clients'][i]['client']['output'][0]['NOM'], "sel": false })
    };
    this.lstNatureInfo = [
      { "code": "cni", "lib": "Carte d'identité Nationale" },
      { "code": "passport", "lib": "Passport" },
      { "code": "permisauto", "lib": "Permis de conduire" },
      { "code": "livretfam", "lib": "Livret de famille" }
    ]
  }
  ngOnInit() {
    this.form = new FormGroup({
      nature: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
      reference: new FormControl('', <any>Validators.required)
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
  natureChange(idx) { }
  takePhoto() {
    let srcType = Camera.PictureSourceType.CAMERA;
    let options = setOptions(srcType);
    let me = this;
    try {
      Camera.getPicture(options).then((imageData) => {
        me.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
        let alert = this.alertCtrl.create({
          title: 'Capture de documents',
          subTitle: 'Appareil non disponible. <br>Erreur  : ' + err,
          buttons: ['OK']
        });
        alert.present();
      });
    } catch (error) {
      let alert = this.alertCtrl.create({
        title: 'Capture de documents',
        subTitle: 'Appareil non disponible : ' + error,
        buttons: ['OK']
      });
      alert.present();
    }

  }
  takeMail() { }
  execute() {
    // Save data to the client folder
    for (let key in this.lstCible) {
      if (this.lstCible[key]['sel']) {
        this.dataIn.resultByClient[key]['doc'].push({ "nature": this.nature, "ts": new Date(), "img64": this.base64Image });
        this.events.publish('rdvSave', this.dataIn);
      }
    }

  }
}
function setOptions(srcType) {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true  //Corrects Android orientation quirks
  }
  return options;
}