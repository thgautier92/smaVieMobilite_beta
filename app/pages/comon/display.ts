import {LoadingController, ToastController, AlertController, NavController} from 'ionic-angular';
import {Injectable} from '@angular/core';

@Injectable()
export class DisplayTools {
    constructor(public nav: NavController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
        this
        this.nav = nav;
    }
    displayLoading(msg, duration?) {
        if (!duration) duration = 5;
        let loading = this.loadingCtrl.create({ content: msg, duration: duration * 1000 });
        loading.present();
        return loading;
    }
    displayToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            showCloseButton: true,
            closeButtonText: "Fermer",
            dismissOnPageChange: true
        });
        toast.onDidDismiss(() => {
            //console.log('Dismissed toast');
        });
        toast.present();
    }
    displayAlert(msg) {
        let alert = this.alertCtrl.create({
            "title": "Message important",
            subTitle: msg,
            buttons: ["J'ai compris"]
        })
       alert.present();
    }
    displayJson(el, data) {

    }
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}