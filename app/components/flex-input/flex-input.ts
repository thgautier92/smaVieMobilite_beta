import { Component, ViewChild, ElementRef, Input, Output, OnInit, OnChanges} from '@angular/core';
import {IONIC_DIRECTIVES, Platform, Events} from 'ionic-angular';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {groupBy, ValuesPipe, KeysPipe} from '../../pipes/common';
import {Paramsdata} from '../../providers/params-data/params-data';
import {Simu} from '../../providers/simu/simu';
import {FlexRadio} from '../flex-radio/flex-radio';

/*
  Generated class for the FlexInput component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'flex-input',
  templateUrl: 'build/components/flex-input/flex-input.html',
  inputs: [, 'idPage', 'idForm', 'dataIn', 'idClient'],
  directives: [IONIC_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FlexRadio],
  pipes: [groupBy, ValuesPipe, KeysPipe],
  providers: [Paramsdata, Simu, FlexRadio]
})
export class FlexInput implements OnInit, OnChanges {
  menuCurrent: any = {};
  dataCurrent: any;
  okForm: boolean = false;
  form: any;
  selectedForm: any = null;
  selectedFields: any = null;
  dataNonInput: any = {};     // data added outside the generic form
  popupWindow: any = null;    // windows object, open for simulation
  simuExec: boolean = false;  // flag for exec simulation 
  @Input() idPage: any;
  @Input() idForm: any;
  @Input() dataIn: any;
  @Input() idClient: any;
  @Input() formTitle: any;
  constructor(private platform: Platform, private fb: FormBuilder, private paramsApi: Paramsdata, private simu: Simu, private events: Events) {
    this.form = this.fb.group({});
  }
  ngOnInit() {
    console.log("==> Data passed to component : ", this.idPage, this.idForm, this.dataIn, this.idClient);
    /*
    this.form = this.fb.group({});
    this.dataCurrent = this.dataIn;
    this.loadForm(this.idForm, this.dataIn['clients'][this.idClient]['client']['output'][0]).then(response => {
      console.log("==> Form created", response);
      this.form = response['formGroup'];
      this.selectedForm = response['selectedForm'];
      if (this.formTitle == "") this.formTitle = this.selectedForm['title'];
      this.selectedFields = response['selectedFields'];
      this.okForm = true;
    }, error => {
      this.okForm = false;
    });
    */
  };
  ngOnChanges(changes: any) {
    //console.log("Data Changes", changes);
    this.idClient = changes.idClient.currentValue;
    if (changes['dataIn']) {
      this.dataCurrent = changes.dataIn.currentValue;
    } else {
      this.dataCurrent = this.dataIn;
    }
    this.loadForm(this.idForm, this.dataIn['clients'][this.idClient]['client']['output'][0]).then(response => {
      console.log("==> Form change", response);
      this.form = response['formGroup'];
      this.selectedForm = response['selectedForm'];
      if (this.formTitle == "") this.formTitle = this.selectedForm['title'];
      this.selectedFields = response['selectedFields'];
      this.okForm = true;
    }, error => {
      this.okForm = false;
    });

  };
  /* ======================================================================
  * Create a form component with 
  *    - all fields parameters and validation control
  *    - default value , initialized from the synchronised folder
  * ======================================================================= */
  loadForm(idForm, dataForm) {
    return new Promise((resolve, reject) => {
      this.paramsApi.getForm(idForm, dataForm).then(data => {
        //console.log("== Return form data ", idForm, data);
        let fields = new groupBy().transform(data['form']['fields'], 'group');
        resolve({ "idForm": idForm, "formGroup": data['formGroup'], "selectedForm": data['form'], "selectedFields": fields })
      }, error => {
        console.error("Impossible de lire le formulaire", idForm);
        console.error(error);
        reject(error);
      });
    });
  }
  initAllFields() {
  }
  initField(idx, modelField) {
    // Init field with data already modified
    //console.log("Load data from current value", this.dataCurrent, modelField);
    let previousData = this.dataIn['rdv']['resultByClient'][this.idClient]['forms'];
    let previousValue = null;
    previousData.forEach(function (f) {
      let model = f['formInput'].filter(item => item['model'] === modelField);
      console.log(model);
      if (model.length > 0) {
        console.log(model[0].value);
        previousValue = model[0].value;
      }
    });
    if (previousValue) {
      console.log(this.form);
      this.form['_value'][modelField] = previousValue;
    }
  }
  // Validation form
  diagNext(formStatus, evt) {
    //console.log("Save data form", this.form.controls, this.selectedForm['fields']);
    //console.log("Click event",evt);
    this.menuCurrent.status = formStatus;
    let fForm = [];
    for (var key in this.form.controls) {
      let question = this.form.controls[key];
      let field = this.selectedForm['fields'].filter(item => item.model === key);
      fForm.push({
        model: key,
        field: field[0]['title'],
        error: question['_errors'],
        pristine: question['_pristine'],
        status: question['_status'],
        touched: question['_touched'],
        value: question['_value']
      });
    }
    let dForm = { "form": this.selectedForm['title'], "status": formStatus, "formInput": fForm, "extraData": this.dataNonInput };
    this.dataIn['rdv']['resultByClient'][this.idClient]['forms'][this.selectedForm.id] = dForm;
    if (this.simuExec) {
      this.simu.getSimu(this.dataNonInput['idSimu']).then(data => {
        console.log("GET SIMU DATA", data);
        this.dataNonInput['simu'] = data['results']['output'][0];
        dForm['extraData'] = this.dataNonInput;
        this.dataIn['rdv']['resultByClient'][this.idClient]['forms'][this.selectedForm.id] = dForm;
        this.events.publish('rdvSave', this.dataIn);
      }, error => {
        console.log(error);
      })
    } else {
      this.events.publish('rdvSave', this.dataIn);
    }
    this.events.publish('rdvStatus_' + this.idPage, { idPage: this.idPage, form: this.selectedForm, status: formStatus });
  }
  // ===== External Simulator with params ====
  openSimu(url) {
    console.log("Open url", url);
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    window.open(url, "_system");
    /*
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open(url, "_system", options);
    });
    */
  }
  openSimuData(idx, field, url) {
    let me = this;
    console.log("OPEN SIMU WITH DATA:", idx, field, url);
    let rdvId = this.dataCurrent['rdv']['rdvId'];
    this.simu.callSimu({ "rdvId": rdvId, "dataIn": this.dataCurrent }).then(data => {
      //console.log("Data from simu",data)
      me.simuExec = true;
      url = data['urlNext'];
      me.dataNonInput['idSimu'] = data['insert_id'];
      let idField = idx;
      let options = "location=yes,clearcache=yes,toolbar=yes,width=800,height=600";
      if (this.popupWindow && !this.popupWindow.closed) {
        this.popupWindow.doRefresh();
      } else {
        this.popupWindow = window.open(url, "SIMU", options);
        this.popupWindow.focus();
      }
      me.events.publish("simuStart", data, this.popupWindow);
    }, error => {
      console.log(error);
      me.simuExec = false;
    });
  }
  onSubmit() {
    //console.log("Submit Form", this.form);
  }
  isValid(ctrl) {
    console.log(ctrl);
  }
  getCheck(model,value){
    return this.form['_value'][model]===value;
  }
}
// ===== Validators method ===================
interface ValidationResult {
  [key: string]: boolean;
}
export class ValidationService {
  static mailFormat(control: FormControl): ValidationResult {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { "incorrectMailFormat": true };
    }
    return null;
  }
  static getValidatorErrorMessage(code: string) {
    let config = {
      'required': 'Obligatoire',
      'invalidCreditCard': 'est un numéro de carte de crédit incorrect',
      'invalidEmailAddress': 'est une adresse mail invalide',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'invalidNumber': 'Ce nombre ne respecte pas les limtes imposées.'
    };
    return config[code];
  }
  static creditCardValidator(control: any) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }
  static numberFormat(control: FormControl, numLimit?: Array<number>): ValidationResult {
    console.log("Bornes : ", numLimit);
    if (numLimit) {
      if (control.value < numLimit[0] || control.value > numLimit[1]) {
        return { "incorrectNumberFormat": true };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  static emailValidator(control: any) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }
  static passwordValidator(control: any) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }
}
// ===== End Validators method ===============
