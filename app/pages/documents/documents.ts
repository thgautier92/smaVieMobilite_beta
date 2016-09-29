import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Paramsdata} from '../../providers/params-data/params-data';
import {File} from 'ionic-native';

/*
  Generated class for the DocumentsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/documents/documents.html',
  providers: [Paramsdata]
})
export class DocumentsPage {
  lstDocs: any = [];
  searchQuery: string = '';
  constructor(private nav: NavController, private paramsApi: Paramsdata) { }
  ngOnInit() {
    this.initializeItems();
  }
  initializeItems() {
    this.paramsApi.loadDocs().then(response => {
      this.lstDocs = response;
    }, error => {
      console.log(error);
    })
  }
  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.lstDocs = this.lstDocs.filter((item) => {
        return (item['lib'].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  onCancel(){
    this.initializeItems();
  }
  openFile(item) {
    //console.log(item);
    this.paramsApi.displayFile(item.file);
  };

}
