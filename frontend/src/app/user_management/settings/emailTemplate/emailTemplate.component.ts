import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CallsService, AuthenticationService } from '../../../_services';

/** 
* Implements password changing directive
*/
@Component({
    moduleId: module.id,
    selector: 'email-template',
    templateUrl: 'emailTemplate.component.html',
    styleUrls: [ './emailTemplate.component.css' ]
})

export class EmailTemplateComponent {

  userName: string = '';
  email: string = '';
  response: any = {};
  template: any = {};
  registrationTemplate: any = null;
  whitelistTemplate: any = null;
  blacklistTemplate: any = null;
  moreInformationTemplate: any = null;
  registrationTemplateFilled: any = false;
  whitelistTemplateFilled: any = false;
  blacklistTemplateFilled: any = false;
  moreInformationTemplateFilled: any = false;

  constructor (
    private router: Router,
    private callsService: CallsService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
  
  }

    /** 
    * Function used for processing registration email template
    * @param {FileList} files - input file
    */
    processRegistrationTemplate(files: FileList) {
        if(files.item(0).type == "text/html"){
            this.registrationTemplateFilled = true;
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
              this.registrationTemplate = fileReader.result;
            }
            fileReader.readAsText(files.item(0));
        }
        else {
          this.alertService.error("All templates must be HTML.");
        }
    }

    /** 
    * Function used for processing whitelist email template
    * @param {FileList} files - input file
    */
    processWhitelistTemplate(files: FileList) {
        if(files.item(0).type == "text/html"){
            this.whitelistTemplateFilled = true;
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
              this.whitelistTemplate = fileReader.result;
            }
            fileReader.readAsText(files.item(0));
        }
        else {
          this.alertService.error("All templates must be HTML.");
        }
    }

    /** 
    * Function used for processing blacklist email template
    * @param {FileList} files - input file
    */
    processBlacklistTemplate(files: FileList) {
        if(files.item(0).type == "text/html"){
            this.blacklistTemplateFilled = true;
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
              this.blacklistTemplate = fileReader.result;
            }
            fileReader.readAsText(files.item(0));
        }
        else {
          this.alertService.error("All templates must be HTML.");
        }
    }

    /** 
    * Function used for processing more information email template
    * @param {FileList} files - input file
    */
    processMoreInfoTemplate(files: FileList) {
        if(files.item(0).type == "text/html"){
            this.moreInformationTemplateFilled = true;
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
              this.moreInformationTemplate = fileReader.result;
            }
            fileReader.readAsText(files.item(0));
        }
        else {
          this.alertService.error("All templates must be HTML.");
        }
    }


  /** 
  * Function used for changing the password
  */
  async saveTemplate(form: any) {
    if(this.registrationTemplateFilled || this.whitelistTemplateFilled || this.blacklistTemplateFilled || this.moreInformationTemplateFilled){
      if(this.registrationTemplateFilled){
        console.log("Uploaded registration template");
        // this.callsService.newTemplate('REGISTRATION',this.registrationTemplate);
  
      }
      if(this.whitelistTemplateFilled){
        console.log("Uploaded whitelist template");
        // this.callsService.newTemplate('WHITELISTED',this.whitelistTemplate);
  
      }
      if(this.blacklistTemplateFilled){
        console.log("Uploaded blacklist template");
        // this.callsService.newTemplate('BLACKLIST',this.blacklistTemplate);
  
      }
      if(this.moreInformationTemplateFilled){
        console.log("Uploaded more information template");
        // this.callsService.newTemplate('MORE_INFORMATION_NEEDED',this.moreInformationTemplate);
  
      }
    }
    else {
      this.alertService.error("Please upload at least one file.");
    }
    
  }


}

