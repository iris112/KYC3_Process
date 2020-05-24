import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';

import { AlertService } from '../_services/index';
import * as $ from 'jquery';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit {
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { 
            this.message = message; 
            window.scrollTo(0,0);
            var alert = document.getElementById('alert') as HTMLElement;
            if(alert != null){
                alert.setAttribute('style','display: block');
            }
            setTimeout(function () {
                var alert = document.getElementById('alert') as HTMLElement;
                if(alert != null){
                    alert.setAttribute('style','display: none');
                }
            },9000);
        });
        // console.log("ALERT ON INIT");
        
    }

}
