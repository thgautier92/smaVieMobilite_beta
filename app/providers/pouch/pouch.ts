import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var PouchDB: any;
/*
  Generated class for the Pouch provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Pouch {
  data: any;
  db:any;
  constructor(private http: Http) {
    this.data = null;
  }
  initBase(base){
    if(!this.db) {
      this.db = new PouchDB(base);
    }
    return this.db;
  }
  getDoc(id) {
    return new Promise((resolve, reject) => {
    })
  }

}

