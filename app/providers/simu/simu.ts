import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Simu provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Simu {
  data: any;
  rootUrl: any = "http://gautiersa.fr/apps/api/v2";
  constructor(private http: Http) {
    this.data = null;
  }
  callSimulator(simulator, data) {
    return new Promise((resolve, reject) => {
      let okCall = false;
      let url: string = "";
      let user: string = "";
      let password: string = "";
      let dataCall: any = {};
      let credHeaders = new Headers();
      //credHeaders.append('Content-Type', 'application/json');
      credHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      credHeaders.append('Accept', 'application/json;charset=utf-8');
      switch (simulator) {
        case 'epicaste':
          break;
        case 'demo':
          url = this.rootUrl + "/vie/simu";
          if (!window['device']) url = "/gsapi/vie/simu";
          user = "demo";
          password = "demo";
          credHeaders.append('Authorization', 'Basic ' + window.btoa(user + ':' + password));
          dataCall = {
            "rdvId": data['rdvId'],
            "dataIn": JSON.stringify(data)
          };
          okCall = true;
          break;
        case 'v1':
          url = this.rootUrl + "/vie/simu";
          if (!window['device']) url = "/gsapi/vie/simu";
          user = "demo";
          password = "demo";
          credHeaders.append('Authorization', 'Basic ' + window.btoa(user + ':' + password));
          dataCall = {
            "rdvId": data['rdvId'],
            "dataIn": JSON.stringify(data)
          };
          okCall = true;
          break;
        default:
      }
      if (okCall) {
        let options = new RequestOptions({ headers: credHeaders });
        this.http.post(url, JSON.stringify(dataCall), options)
          .subscribe(res => {
            //console.log("Post response", res);
            resolve(JSON.parse(res['_body']));
          }, error => {
            console.log("Post error", JSON.stringify(error));
            if (typeof (error['_body']) === "string") {
              reject(JSON.parse(error['_body']));
            } else {
              reject({ error: "Erreur appel", reason: "Le service n'est pas disponible." });
            }
          });
      } else {
        reject({ error: "Erreur Simulateur", reason: "Le service n'est pas développé." })
      }
    });
  }
  getSimulatorById(simulator, id) {
    return new Promise((resolve, reject) => {
      let okCall = false;
      let url: string = "";
      let user: string = "";
      let password: string = "";
      let dataCall: any = {};
      let credHeaders = new Headers();
      //credHeaders.append('Content-Type', 'application/json');
      credHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      credHeaders.append('Accept', 'application/json;charset=utf-8');
      switch (simulator) {
        case 'epicaste':
          break;
        case 'demo':
          url = this.rootUrl + "/vie/simu/" + id;
          if (!window['device']) url = "/gsapi/vie/simu/" + id;
          user = "demo";
          password = "demo";
          credHeaders.append('Authorization', 'Basic ' + window.btoa(user + ':' + password));
          okCall = true;
          break;
        case 'v1':
          url = this.rootUrl + "/vie/simu/" + id;
          if (!window['device']) url = "/gsapi/vie/simu/" + id;
          user = "demo";
          password = "demo";
          credHeaders.append('Authorization', 'Basic ' + window.btoa(user + ':' + password));
          okCall = true;
          break;
        default:
      }
      if (okCall) {
        let options = new RequestOptions({ headers: credHeaders });
        this.http.get(url, options)
          .subscribe(res => {
            //console.log("Post response", res);
            resolve(JSON.parse(res['_body']));
          }, error => {
            console.log("Post error", JSON.stringify(error));
            if (typeof (error['_body']) === "string") {
              reject({ error: "Erreur", reason: "La simulation n'est pas disponible." });
            } else {
              reject({ error: "Erreur appel", reason: "Le service n'est pas disponible." });
            }
          });
      } else {
        reject({ error: "Erreur Simulateur", reason: "Le service n'est pas développé." })
      }
    });
  }
  // ===== Demo call to EPICASTE simulator ====
  epicastGetSimu() {
    return [{ "idSimu": 254, "code": "BRM", "produit": "Batiretraite Multicompte", "dateSimu": "12/09/2016" },
      { "idSimu": 854, "code": "BRM", "produit": "Batiretraite Multicompte", "dateSimu": "24/08/2016" },
      { "idSimu": 3985, "code": "BRM", "produit": "Batiretraite Multicompte", "dateSimu": "18/02/2016" },
      { "idSimu": 6, "code": "BPM", "produit": "Batiplacement Multicompte PEA", "dateSimu": "30/03/2016" },
      { "idSimu": 9, "code": "BPM", "produit": "Batiplacement Multicompte PEA", "dateSimu": "17/07/2016" }]
  }
  // ===== Old version off simulator integartion ====
  callSimu(data) {
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + "/vie/simu";
      if (!window['device']) {
        console.log("Proxy CORS added for Web application");
        url = "/gsapi/vie/simu";
      }
      // ***** To be modified for a specific target *****
      let dataCall: any = {
        "rdvId": data['rdvId'],
        "dataIn": JSON.stringify(data)
      };
      let user = "demo";
      let password = "demo";
      let credHeaders = new Headers();
      //credHeaders.append('Content-Type', 'application/json');
      credHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      credHeaders.append('Accept', 'application/json;charset=utf-8');
      credHeaders.append('Authorization', 'Basic ' + window.btoa(user + ':' + password))
      let options = new RequestOptions({ headers: credHeaders });
      this.http.post(url, JSON.stringify(dataCall), options)
        .subscribe(res => {
          //console.log("Post response", res);
          resolve(JSON.parse(res['_body']));
        }, error => {
          console.log("Post error", JSON.stringify(error));
          if (typeof (error['_body']) === "string") {
            reject(JSON.parse(error['_body']));
          } else {
            reject({ error: "Erreur appel", reason: "Le service n'est pas disponible." });
          }
        });
    });
  }
  getSimu(id) {
    return new Promise((resolve, reject) => {
      let url = this.rootUrl + "/vie/simu";
      if (!window['device']) {
        console.log("Proxy CORS added for Web application");
        url = "/gsapi/vie/simu";
      }
      // ***** To be modified for a specific target *****
      let user = "demo";
      let password = "demo";
      let credHeaders = new Headers();
      //credHeaders.append('Content-Type', 'application/json');
      credHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      credHeaders.append('Accept', 'application/json;charset=utf-8');
      credHeaders.append('Authorization', 'Basic ' + window.btoa(user + ':' + password))
      let options = new RequestOptions({ headers: credHeaders });
      this.http.get(url + "/" + id, options)
        .subscribe(res => {
          //console.log("Get response", res);
          resolve(JSON.parse(res['_body']));
        }, error => {
          console.log("Get error", error);
          if (typeof (error['_body']) === "string") {
            reject(JSON.parse(error['_body']));
          } else {
            reject({ error: "Erreur appel", reason: "Le service n'est pas disponible." });
          }
        });
    });
  }
}

