import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {SignServices} from '../../providers/sign/sign';

/*
  Generated class for the SignApiPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/sign-api/sign-api.html',
  providers: [SignServices],
})
export class SignApiPage {
  lstSign: any = [];
  lstApi: any = [];
  srv: any;
  api:any;
  result:any;
  constructor(private nav: NavController, private sign: SignServices) {
    this.srv = "";
    this.api=""
    this.sign.getLstParams().then(response => {
      this.lstSign = response;
    })
  }
  loadApi(srv) {
    console.log(srv);
    this.sign.getApi(srv).then(response => {
      console.log(response);
      this.lstApi = response;
    }, error => {
      console.log(error);
    })
  }
  callApi(){
    console.log(this.srv, this.api);
    this.sign.callApi(this.srv,this.api).then(response=>{
      console.log(response);
      this.result=response;
    },error=>{
      console.log(error);
    })
  }
}
