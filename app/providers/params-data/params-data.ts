import {Storage, LocalStorage} from 'ionic-angular';
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { FORM_DIRECTIVES, Control, ControlGroup, AbstractControl } from '@angular/common';
import {FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

const mailFormat = '/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i';
/*
  Generated class for the ParamsparamsForm provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

@Pipe({
  name: 'searchTab'
})
@Injectable()
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
    return items.filter(item => item.id.indexOf(args[0]) !== -1);
  }
}
*/
@Injectable()
export class Paramsdata {
  local: any;
  keyStore: any;
  paramsForm: any = null;
  refs: any = null;
  dataMenu: any = null;
  dataForms: any = null;
  dataDocs: any = null;
  fb: FormBuilder;
  constructor(public http: Http, fb: FormBuilder) {
    this.local = new Storage(LocalStorage);
    this.keyStore = "dataForms";
    this.fb = fb;
    this.dataForms = [];
  }
  /* ========
  List the documents avaible in the application
  All docs are stored in www/data/docs
  ===== */
  loadDocs() {
    if (this.dataDocs) {
      // already loaded paramsForm
      return Promise.resolve(this.dataDocs);
    }
    // don't have the paramsForm yet
    return new Promise(resolve => {
      this.http.get('data/docs.json')
        .map(res => res.json())
        .subscribe(data => {
          this.dataDocs = data['docs'];
          resolve(this.dataDocs);
        });
    });
  }
  // Load and display a file (pdf,...) in internal navigator (inAppBrowser plugin)
  displayFile(file) {
    if (file !== "") 
     window.open("file://data/docs/" + file, "_system");
  }
  loadRefs(id?) {
    return new Promise(resolve => {
      if (this.refs) {
        console.log("Return REFS from MEMORY");
        if (id) {
          let r = this.refs.filter(item => item.id == id);
          resolve(r[0]);
        } else {
          resolve(this.refs);
        }
      } else {
        this.http.get('data/refs.json')
          .map(res => res.json())
          .subscribe(refs => {
            console.log(refs);
            this.refs = refs;
            if (id) {
              let r = this.refs.filter(item => item.id == id);
              resolve(r[0]);
            } else {
              resolve(this.refs);
            }
          });
      }
    });
  }
  /* ===== Methods for configuring dynamics forms ===== */
  loadForm() {
    return new Promise(resolve => {
      if (this.paramsForm) {
        console.log("Return forms from MEMORY");
        resolve(this.paramsForm);
      } else {
        this.http.get('data/forms.json')
          .map(res => res.json())
          .subscribe(paramsForm => {
            this.paramsForm = paramsForm;
            resolve(this.paramsForm);
          });
      }
    });
  }
  getForm(id, dataSI?, dataRdv?) {
    /*
    console.log("=====Get form id", id)
    console.log("=====Get form data From SI", dataSI);
    console.log("=====Get form data From Input", dataRdv);
    */
    if (!dataRdv) dataRdv = { "forms": [] }
    return new Promise((resolve, reject) => {
      this.loadForm().then((data) => {
        //console.log("=====Forms Parameters ", data);
        if (data) {
          let ret = {}
          let form = data['forms'].filter(item => item['id'] == id);
          //console.log("=====Form find fo id", id, form);
          let formModel = data['dataToForm'];
          if (form.length == 0) {
            form = data['forms'].filter(item => item['id'] === 1);
          }
          //console.log("=====Form ", form);
          ret['form'] = form[0];
          let group = new FormGroup({});
          let groupValue = {};
          form[0]['fields'].forEach(question => {
            // Search field value
            let modelValue;
            // 1. Search in data allready input in all forms
            let f = [];
            dataRdv['forms'].forEach((elt, key) => {
              if (elt) {
                elt['formInput'].forEach(field => {
                  if (field['model'] == question['model']) f.push(field['value']);
                });
              }
            });
            if (f.length > 0) {
              modelValue = f[0];        // Just the first value is avaible
            } else {
              // 2. Search in data data from the IS
              let model = formModel.filter(item => item['field'] === question['model']);
              if (model.length > 0) {
                modelValue = dataSI[model[0]['dataSource']];
              } else {
                // 3. Set default value by type
                switch (question['type']) {
                  case "number":
                    modelValue = 0
                    break;
                  case "boolean":
                    modelValue = false;
                    break;
                  case "radio":
                    modelValue = "";
                    break;
                  default:
                    modelValue = '';
                }
              }
            }
            let field = question['model'];
            //console.log("=== CREATE THE CONTROL", field, modelValue);
            question['value'] = modelValue;

            // Generate validators
            let lstValidator = [];
            //lstValidator.push(question['value'] || '');
            if (question['required']) lstValidator.push(Validators.required);
            if (question['type'] == 'email') lstValidator.push(ValidationService.emailValidator);
            if (question['type'] == 'number') lstValidator.push(ValidationService.numberFormat);
            // Create the control
            let ctrl = new FormControl(modelValue, Validators.compose(lstValidator));
            groupValue[field] = modelValue;
            //ctrl.updateValue(modelValue);
            group.addControl(field, ctrl);
            //console.log("==== Question", group);
          });
          //console.log("=====Form Group ", group, this.fb);
          //let formB = group;
          ret['formGroup'] = group;
          //console.log("=====Return forms ", ret);
          resolve(ret);
        } else {
          console.log("=====Return NULL forms ");
          reject(null);
        }
      })
    });
  };
}

// ===== Specific validator for input =====
export class GlobalValidator {
  static mailFormat(control: Control): ValidationResult {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { "incorrectMailFormat": true };
    }
    return null;
  }
}
interface ValidationResult {
  [key: string]: boolean;
}
export class ValidationService {
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
  static numberFormat(control: Control, numLimit?: Array<number>): ValidationResult {
    //console.log("Bornes : ", numLimit);
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


/* ===== Deprecated =====
    loadMenu() {
      if (this.dataMenu) {
        // already loaded paramsForm
        return Promise.resolve(this.dataMenu);
      }
      // don't have the paramsForm yet
      return new Promise(resolve => {
        this.http.get('data/menus.json')
          .map(res => res.json())
          .subscribe(dataMenu => {
            this.dataMenu = dataMenu;
            resolve(this.dataMenu);
          });
      });
    }
  ===== */

  /* ===== Not Use =====
  * Methods for local data store during forms input
    initDataForms() {
      this.dataForms[0] = { ts: new Date() };
      this.local.set(this.keyStore, JSON.stringify(this.dataForms));
    }
    storeDataForms(id, data) {
      this.dataForms[id] = data;
      this.local.set(this.keyStore, JSON.stringify(this.dataForms));
    }
    getDataForms() {
      return JSON.parse(this.local.get(this.keyStore));
    }
  ===== */