import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CallsService, AuthenticationService } from '../../_services';
import { config } from '../../../assets/configuration';

/** 
* Implements the Settings page
*/
@Component({
    moduleId: module.id,
    templateUrl: 'settings.component.html',
    styleUrls: [ './settings.component.css' ]
})

export class SettingsComponent implements OnInit {

  oldPassword: string = '';
  newPassword: string = '';
  selectedItem: string = '';
  response: any = {};
  passwordDisplay: any = true;
  createAdminDisplay: any = false;
  emailServerDisplay: any = false;
  emailTemplateDisplay: any = false;
  mainColor: any = config.mainColor;

  constructor (
    private callsService: CallsService
  ) {
  
  }

  ngOnInit() {
    // this.callsService.getAdmins().subscribe(
    //   data => {
    //     this.response = data;
    //     this.callsService.setAdminList(this.response);
    //   }
    // );
  }
  /** 
  * Function for menu navigation
  * @param {String} selectedItem - selected item
  */
  menuClick(selectedItem: string){
    switch(selectedItem) {
      case 'password': {
        selectedItem = '';
        this.createAdminDisplay = false;
        this.passwordDisplay = true;
        this.emailServerDisplay = false;
        this.emailTemplateDisplay = false;
        break;
      }
      case 'createAdmin': {
        selectedItem = '';
        this.createAdminDisplay = true;
        this.passwordDisplay = false;
        this.emailServerDisplay = false;
        this.emailTemplateDisplay = false;
        break;
      }
      case 'emailServer': {
        selectedItem = '';
        this.createAdminDisplay = false;
        this.passwordDisplay = false;
        this.emailServerDisplay = true;
        this.emailTemplateDisplay = false;
        break;
      }
      case 'emailTemplate': {
        selectedItem = '';
        this.createAdminDisplay = false;
        this.passwordDisplay = false;
        this.emailServerDisplay = false;
        this.emailTemplateDisplay = true;
        break;
      }
    }
  }

}

