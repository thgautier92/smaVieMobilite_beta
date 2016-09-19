import {Loading, Toast, NavController, Events} from 'ionic-angular';
import {Injectable} from '@angular/core';


@Injectable()
export class CalcTools {
    constructor(private nav: NavController, private events: Events) {
    }

    /* ============================================================ 
      * Function to calculate the page status, regarding each form status, included in the page
      *   idPage : the index of the page/tab to update
      *   lstForms : a JSON list of forms included in the page
      *     { "id": 1, "status": "" }
      * 
      * The function push an event "menuStatusChange" at the end of calc
      ================================================================= */
    calcPageStatus(idPage, lstForms) {
        let score = 0;
        let pageStatus = "hold";
        lstForms.forEach(function (item) {
            if (item.status === "completed") score = score + 1
        });
        if (score === lstForms.length) pageStatus = "completed";
        if (score === 0) pageStatus = "hold";
        if (score > 0 && score < lstForms.length) pageStatus = "partial";
        this.events.publish('menuStatusChange', { "id": idPage, "status": pageStatus });
        return true;
    };
}