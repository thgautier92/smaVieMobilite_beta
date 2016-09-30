import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController } from 'ionic-angular';
import {Paramsdata} from '../../providers/params-data/params-data';
import {PdfViewer} from '../../components/pdf-viewer/pdf-viewer';


/*
  Generated class for the DocumentsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/documents/documents.html',
  providers: [Paramsdata],
  directives: [PdfViewer]
})
export class DocumentsPage {
  lstDocs: any = [];
  searchQuery: string = '';
  constructor(private nav: NavController, private modalCtrl: ModalController, private paramsApi: Paramsdata) { }
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
  onCancel() {
    this.initializeItems();
  }
  openFile(item) {
    //console.log(item);
    //let modal = this.modalCtrl.create(ViewPage, { "file": item.file, "title":item.lib });
    //modal.present();
    if(item.file!=="") this.nav.push(ViewPage, { "file": item.file, "title":item.lib });
  };
}

@Component({
  templateUrl: 'build/pages/documents/view.html',
  providers: [],
  directives: [PdfViewer]
})
export class ViewPage {
  file: any;
  title:any="";
  constructor(private nav: NavController, private navParams: NavParams, private viewCtrl: ViewController) {
    console.log(this.navParams);
    this.file = this.navParams.data['file'];
    this.title=this.navParams.data['title'];
    console.log(this.file);
  }
  close() {
    this.viewCtrl.dismiss();
  }

}