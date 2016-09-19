import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the JsonDemo provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class JsonDemo {
  data: any;

  constructor(private http: Http) {
    this.data = null;
  }
  load(file) {
    return new Promise((resolve, reject) => {
      if (file) {
        this.http.get('./data/' + file + '.json')
          .map(res => res.json())
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          }, error => {
            reject("les données de démonstration '" + file + "' n'existe pas !");
          });
      } else {
        reject("Aucune données disponibles !");
      }
    });
  }
}

