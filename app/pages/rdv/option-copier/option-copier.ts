import { Component } from '@angular/core';
import { Page, NavController, NavParams, Events, Modal, IONIC_DIRECTIVES, Platform, ViewController } from 'ionic-angular';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl} from '@angular/common';
import {Paramsdata} from '../../../providers/params-data/params-data';
import {groupBy, ValuesPipe, KeysPipe} from '../../../pipes/common';

/*
  Generated class for the OptionCopierPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/rdv/option-copier/option-copier.html',
  pipes: [groupBy, ValuesPipe, KeysPipe],
  directives: [IONIC_DIRECTIVES, FORM_DIRECTIVES],
  providers: [Paramsdata]
})
export class OptionCopierPage {
  idClient: any;
  dataIn: any;
  lstCible: any;
  lstNatureInfo: any;
  lstfields: any = [];
  cible: any = null;
  nature: any = "";
  constructor(private nav: NavController, params: NavParams, private viewCtrl: ViewController, private events: Events, private menu: Paramsdata) {
    this.idClient = params.data['currentCli'];
    this.dataIn = params.data['currentDoc'];
    this.lstCible = this.dataIn['clients'];
    console.log("Liste cible", this.lstCible);
    this.lstNatureInfo = [
      { "code": "diag", "lib": "Diagnostic Conseil", "forms": [3, 4] },
      { "code": "sous", "lib": "Souscription", "forms": [5, 6] }
    ]
  }
  natureChange(idx) {
    this.lstfields = [];
    let l = this.lstNatureInfo.filter(item => item['code'] === idx);
    let lstForms = l[0]['forms'];
    //console.log("LIST FORMS for nature", idx, lstForms);
    let refForms = []
    this.menu.loadForm().then(forms => {
      let refForms = forms['forms'];
      lstForms.forEach(element => {
        this.lstfields.push(refForms[element]);
      });
      console.log(this.lstfields);
    });
  }
  close() {
    this.viewCtrl.dismiss();
  }
  execute() {
    console.log("Cible",this.cible)
    this.events.publish('copyClientChange', {'id':this.cible});
    this.viewCtrl.dismiss();
  }
}
