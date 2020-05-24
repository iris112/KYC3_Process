import { Component, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService, CallsService } from '../../_services';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as FileSaver from 'file-saver';
import {config} from '../../../assets/configuration';
import { saveAs } from 'file-saver/FileSaver';
import { FormDataService } from '../register/data/formData.service';

/** 
 * Implements the user detail page
*/
@Component({
    moduleId: module.id,
    templateUrl: 'detail.component.html',
    styleUrls: [ './detail.component.css' ]
})
export class DetailComponent implements OnInit {
  model: any = {};
  loading = false;
  loadingImg = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==';
  progress: any = 22;
  username = '';
  response: any = {};
  safeSelfie: SafeResourceUrl;
  safePassportFront: SafeResourceUrl;
  safePassportBack: SafeResourceUrl;
  safeProofOfResidence: SafeResourceUrl;
  safeSelfieVideo: any;
  slideIndex: any = 1;
  loadingCheck: any = false;
  largePassportFront: BsModalRef;
  largePassportBack: BsModalRef;
  largeSelfie: BsModalRef;
  largeProofOfResidence: BsModalRef;
  htmlInput = '';
  exportStatus: any = '';
  exportPEPScore: any = '';
  exportSanctionScore: any = '';
  exportMRZ: any = '';
  exportDob: any = '';
  exportDoe: any = '';
  mainColor: any = config.mainColor;
  words: any = [];
  returnWords: any = [];
  wordsObject: any = {};
  logo: any = "data:image/png;base64,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";

  constructor (
    private callsService: CallsService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private modalService: BsModalService,
    private formDataService: FormDataService
  ) {
    this.route.params.subscribe(
      params => {
        if (params.username) {
          this.username = params.username;
        }
      }
    );
  }

  ngOnInit() {
    this.getAccount();
    this.showDivs(this.slideIndex);
  }

  /** 
   * Function used for displaying modal with enlarged Identity document Front
  */
  enlargePassportFront(template: TemplateRef<any>){
    this.largePassportFront = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  /** 
   * Function used for displaying modal with enlarged Identity document Back
  */
  enlargePassportBack(template: TemplateRef<any>){
    this.largePassportBack = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  /** 
   * Function used for displaying modal with enlarged Selfie
  */
  enlargeSelfie(template: TemplateRef<any>){
    this.largeSelfie = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  /** 
   * Function used for displaying modal with enlarged Proof Of Residence
  */
  enlargeProofOfResidence(template: TemplateRef<any>){
    this.largeProofOfResidence = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }


  /** 
   * Function used for image gallery navigation
  */
  plusDivs(n) {
    this.showDivs(this.slideIndex += n);
  }

  /** 
   * Function used for image gallery navigation
  */
  showDivs(n) {
    var i;
    var x = (document.getElementsByClassName('uploadedImages') as HTMLCollectionOf<HTMLElement>);
    if (n > x.length) {this.slideIndex = 1} 
    if (n < 1) {this.slideIndex = x.length} ;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = 'none'; 
    }
    x[this.slideIndex-1].style.display = 'block'; 
  }

  /** 
   * Function used to save the comment
  */
  saveComment(){
    console.log(this.model);
    this.callsService.saveComment(this.model.comment,this.username).subscribe(
      data => { 
        console.log(data)
      },
      error => {
        if(error.error.text == 'saved.'){
            this.alertService.success('Saved comment successfully.');
            this.getAccount();
        }
        else {
          this.alertService.error('Something went wrong.');
          console.log(error)
        }
      }
    );
  }

  /** 
   * Function used to set the KYC status
   * @param {any} userName - user to set the status for
   * @param {any} kycStatus - the value of KYC status (1 - Low Risk, 2 - Medium Risk, 3 - High Risk) 
  */
  setKYCStatus(userName: any, kycStatus: any){
    console.log("Changed KYC status for user " + userName + " to " + kycStatus);
    this.callsService.setKYCStatus(userName,kycStatus).subscribe(
      data => { 
        console.log(data)
      },
      error => {
        if(error.error.text == "done."){
            this.alertService.success("Changed status successfully.");
            this.getAccount();
        }
        else {
          this.alertService.error("Something went wrong.");
          console.log(error)
        }
      }
    );
  }

  /** 
   * Function which runs checks for selected users
  */
  checkUsers(){
    this.loading = true;
    console.log("Check users triggered");
    this.callsService.evalList(this.username).subscribe(
      data => {
        if (data!=null) {
          if(data == "1"){
            this.loading = false;
            this.alertService.success("Check successful.");
            this.getAccount();
          }
        } else {
          this.alertService.error("Something went wrong.");
          this.loading = false;
        }
      },
      error => {
          this.alertService.error("Something went wrong.");
          this.loading = false;
          console.log(error);
      }
    );
  }

  longestSubstring: any = '';
  helperWords: any = [];
  
  /** 
   * Function used to retreive details for a specific user
  */
  getAccount() {
    console.log('getAccount');    
    this.callsService.getUserDetails(this.username).subscribe(
      data => { 
        this.model = data;
        // console.log(this.model.details.wordList);
        // console.log(this.model.status.returnList);
        // TODO
        this.returnWords = this.model.status.returnList;
        this.words = this.model.details.wordList;

        // this.returnWords = ['november','xray'];
        // this.words = ['echo','november','november','whiskey','xray'];

        // this.correctWords = this.longestSubstring.split(',');

        this.wordsObject.words = this.words;
        // TODO
        this.wordsObject.returnWords = this.returnWords;
        // this.wordsObject.helperWords = this.returnWords;

        this.wordsObject.match = [];

        for(var i = 0; i < this.words.length; i++){
          // TODO
          if(this.returnWords[i] == true){
            // TODO
           this.wordsObject.match.push(1);
          // TODO
          }
          // TODO
          else {
            this.wordsObject.match.push(0);
            // TODO
          }
            // if(this.wordsObject.helperWords.indexOf(this.words[i]) == -1){
            //   this.wordsObject.match.push(0);
            // }
            // else {
            //   this.wordsObject.helperWords.splice(this.wordsObject.helperWords.indexOf(this.words[i]),1);
            //   this.wordsObject.match.push(1);
            // }
        }

        console.log(this.wordsObject);
        var selfieVideo = document.getElementById('selfie-video') as HTMLVideoElement;
        this.safeSelfieVideo = 'data:video/webm;base64,' + this.model.details.selfieVideo;
        selfieVideo.src = this.safeSelfieVideo;
        this.safePassportFront = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.model.details.passportFront);
        if (this.model.details.passportBack){
          this.safePassportBack = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.model.details.passportBack);
        }
        this.safeProofOfResidence = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.model.details.proofOfResidence);
      },
      error => console.log(error)
    );
  }

  /** 
   * Function used to export a client dossier
  */
  exportUser() {
    // Matching numbers with their textual description
    console.log("Model");
    console.log(this.model);
    console.log("Passport Back");
    console.log(this.model.details.passportBack);
    switch (this.model.status.kycStatus) {
      case 0: {this.exportStatus = "Not Started";break;}
      case 1: {this.exportStatus = "Low Risk";break;}
      case 2: {this.exportStatus = "Medium Risk";break;}
      case 3: {this.exportStatus = "High Risk";break;}
    }

    switch (this.model.riskResult.sanctionScore) {
      case 0: {this.exportSanctionScore = "Not Started";break;}
      case 1: {this.exportSanctionScore = "Low Risk";break;}
      case 2: {this.exportSanctionScore = "Medium Risk";break;}
      case 3: {this.exportSanctionScore = "High Risk";break;}
    }
    
    switch (this.model.riskResult.pepScore) {
      case 0: {this.exportPEPScore = "Not Started";break;}
      case 1: {this.exportPEPScore = "Low Risk";break;}
      case 2: {this.exportPEPScore = "Medium Risk";break;}
      case 3: {this.exportPEPScore = "High Risk";break;}
    }

    if(this.model.status.mrz){
      if (this.model.status.mrz.mrzCheck == false){
        this.exportMRZ = "Not successful";
      }
      else {
        this.exportMRZ = "Successful";
      }

      if (this.model.status.mrz.dobCheck == false){
        this.exportDob = "Not successful";
      }
      else {
        this.exportDob = "Successful";
      }

      if (this.model.status.mrz.doeCheck == false){
        this.exportDoe = "Not successful";
      }
      else {
        this.exportDoe = "Successful";
      }
    }

    if(this.model.status.mrz && this.model.details.passportBack){
      this.htmlInput = "<html><head><style type=\"text/css\">table.table-style-one{font-size:14px;color:#333333;}table.table-style-one th{padding: 8px;background-color: #B3B3B3;}table.table-style-one td{padding: 8px;background-color: #ffffff;}table.table-style-two{font-size:14px;color:#333333;}table.table-style-two th{padding: 8px;background-color: #B3B3B3;}table.table-style-two td{padding: 8px;background-color: #ffffff;}</style></head><body><h2 style=\"text-align: center;text-decoration: underline\">CLIENT DOSSIER</h2><table class=\"table-style-two\"><tr><td><h4 style=\"color:#337ab7;\">INFORMATION PROVIDED BY USER</h4><table class=\"table-style-one\"><tr><td><b>First name:</b></td><td>" + this.model.firstName + "</td></tr><tr><td><b>Last name:</b></td><td>" + this.model.lastName + "</td></tr><tr><td><b>Date of Birth:</b></td><td>" + this.model.details.dateOfBirth + "</td></tr><tr><td><b>Nationality:</b></td><td>" + this.model.details.nationality + "</td></tr><tr><td><b>Address:</b></td><td>" + this.model.details.address + "</td></tr><tr><td><b>Wallet:</b></td><td>" + this.model.details.walletAddress + "</td></tr><tr><td><b>Amount:</b></td><td>" + this.model.details.amount + " " + this.model.details.currencyType + "</td></tr><tr><td><b>Username:</b></td><td>" + this.model.userName + "</td></tr><tr><td><b>Email:</b></td><td>" + this.model.email + "</td></tr></table></td><td style=\"text-align: center;\"> <b>Identity document (front):</b><br /><img src=\"data:image/jpg;base64," + this.model.details.passportFront + "\" style=\"width: 200px\" /></td></tr><tr><td><h4 style=\"color:#337ab7;\">KYC STATUS</h4><table class=\"table-style-one\"><tr><td><b>Overall status:</b></td><td>" + this.exportStatus + "</td></tr><tr><td><b>PEP Score:</b></td><td>" + this.exportPEPScore + "</td></tr><tr><td><b>Sanction Score:</b></td><td>" + this.exportSanctionScore + "</td></tr><tr><td><b>Risk Score:</b></td><td>" + Math.round(this.model.riskResult.riskScore*100)/100 + "</td></tr><tr><td><b>MRZ:</b></td><td>" + this.exportMRZ + "</td></tr><tr><td><b>Comment:</b></td><td>" + this.model.status.comment + "</td></tr></table></td><td style=\"text-align: center;\"><b>Identity document (back):</b><br /><img src=\"data:image/jpg;base64," + this.model.details.passportBack + "\" style=\"width: 200px\" /></td></tr><tr><td><h4 style=\"color:#337ab7;\">INFORMATION EXTRACTED FROM MRZ</h4><table class=\"table-style-one\"><tr><td><b>First name:</b></td><td>" + this.model.status.mrz.givenName + "</td></tr><tr><td><b>Last name:</b></td><td>" + this.model.status.mrz.surname + "</td></tr><tr><td><b>Date of Birth:</b></td><td>" + this.model.status.mrz.dateOfBirth + "</td></tr><tr><td><b>Issuing country:</b></td><td>" + this.model.status.mrz.issuingCountry + "</td></tr><tr><td><b>Document number:</b></td><td>" + this.model.status.mrz.passportNumber + "</td></tr><tr><td><b>Date of birth check:</b></td><td>" + this.exportDob + "</td></tr><tr><td><b>Date of expiration check:</b></td><td>" + this.exportDoe + "</td></tr></table></td><td style=\"text-align: center;\"><b>Selfie:</b><br /><img src=\"data:image/jpg;base64," + this.model.details.selfie + "\" style=\"width: 150px\" /></td></tr></table><div style=\"page-break-before: always; font-size: 14px\"><b>Proof of Residence:</b><br /><div style=\"text-align: center;\"><img src=\"data:image/jpg;base64," + this.model.details.proofOfResidence + "\" style=\"width: 600px\" /></div>Report generated: " + new Date().toLocaleString() + "<div style=\"height: 20px\"></div>Powered by &nbsp;&nbsp; <img src=\"" + this.logo + "\" style=\"width: 75px;\" /></div></body></html>";
    }
    else {
      if(this.model.status.mrz){
        this.htmlInput = "<html><head><style type=\"text/css\">table.table-style-one{font-size:14px;color:#333333;}table.table-style-one th{padding: 8px;background-color: #B3B3B3;}table.table-style-one td{padding: 8px;background-color: #ffffff;}table.table-style-two{font-size:14px;color:#333333;}table.table-style-two th{padding: 8px;background-color: #B3B3B3;}table.table-style-two td{padding: 8px;background-color: #ffffff;}</style></head><body><h2 style=\"text-align: center;text-decoration: underline\">CLIENT DOSSIER</h2><table class=\"table-style-two\"><tr><td><h4 style=\"color:#337ab7;\">INFORMATION PROVIDED BY USER</h4><table class=\"table-style-one\"><tr><td><b>First name:</b></td><td>" + this.model.firstName + "</td></tr><tr><td><b>Last name:</b></td><td>" + this.model.lastName + "</td></tr><tr><td><b>Date of Birth:</b></td><td>" + this.model.details.dateOfBirth + "</td></tr><tr><td><b>Nationality:</b></td><td>" + this.model.details.nationality + "</td></tr><tr><td><b>Address:</b></td><td>" + this.model.details.address + "</td></tr><tr><td><b>Wallet:</b></td><td>" + this.model.details.walletAddress + "</td></tr><tr><td><b>Amount:</b></td><td>" + this.model.details.amount + " " + this.model.details.currencyType + "</td></tr><tr><td><b>Username:</b></td><td>" + this.model.userName + "</td></tr><tr><td><b>Email:</b></td><td>" + this.model.email + "</td></tr></table></td><td style=\"text-align: center;\"> <b>Identity document (front):</b><br /><img src=\"data:image/jpg;base64," + this.model.details.passportFront + "\" style=\"width: 200px\" /></td></tr><tr><td><h4 style=\"color:#337ab7;\">KYC STATUS</h4><table class=\"table-style-one\"><tr><td><b>Overall status:</b></td><td>" + this.exportStatus + "</td></tr><tr><td><b>PEP Score:</b></td><td>" + this.exportPEPScore + "</td></tr><tr><td><b>Sanction Score:</b></td><td>" + this.exportSanctionScore + "</td></tr><tr><td><b>Risk Score:</b></td><td>" + Math.round(this.model.riskResult.riskScore*100)/100 + "</td></tr><tr><td><b>MRZ:</b></td><td>" + this.exportMRZ + "</td></tr><tr><td><b>Comment:</b></td><td>" + this.model.status.comment + "</td></tr></table></td><td style=\"text-align: center;\"><b>Selfie:</b><br /><img src=\"data:image/jpg;base64," + this.model.details.selfie + "\" style=\"width: 150px\" /></td></tr><tr><td><h4 style=\"color:#337ab7;\">INFORMATION EXTRACTED FROM MRZ</h4><table class=\"table-style-one\"><tr><td><b>First name:</b></td><td>" + this.model.status.mrz.givenName + "</td></tr><tr><td><b>Last name:</b></td><td>" + this.model.status.mrz.surname + "</td></tr><tr><td><b>Date of Birth:</b></td><td>" + this.model.status.mrz.dateOfBirth + "</td></tr><tr><td><b>Issuing country:</b></td><td>" + this.model.status.mrz.issuingCountry + "</td></tr><tr><td><b>Document number:</b></td><td>" + this.model.status.mrz.passportNumber + "</td></tr><tr><td><b>Date of birth check:</b></td><td>" + this.exportDob + "</td></tr><tr><td><b>Date of expiration check:</b></td><td>" + this.exportDoe + "</td></tr></table></td></tr></table><div style=\"page-break-before: always; font-size: 14px\"><b>Proof of Residence:</b><br /><div style=\"text-align: center;\"><img src=\"data:image/jpg;base64," + this.model.details.proofOfResidence + "\" style=\"width: 600px\" /></div>Report generated: " + new Date().toLocaleString() + "<div style=\"height: 20px\"></div>Powered by &nbsp;&nbsp; <img src=\"" + this.logo + "\" style=\"width: 75px;\" /></div></body></html>";
      }
      else {
        this.htmlInput = "<html><head><style type=\"text/css\">table.table-style-one{font-size:14px;color:#333333;}table.table-style-one th{padding: 8px;background-color: #B3B3B3;}table.table-style-one td{padding: 8px;background-color: #ffffff;}table.table-style-two{font-size:14px;color:#333333;}table.table-style-two th{padding: 8px;background-color: #B3B3B3;}table.table-style-two td{padding: 8px;background-color: #ffffff;}</style></head><body><h2 style=\"text-align: center;color: #337ab7;text-decoration: underline\">CLIENT DOSSIER</h2><table class=\"table-style-two\"><tr><td><h4 style=\"color:#337ab7;\">INFORMATION PROVIDED BY USER</h4><table class=\"table-style-one\"><tr><td><b>First name:</b></td><td>" + this.model.firstName + "</td></tr><tr><td><b>Last name:</b></td><td>" + this.model.lastName + "</td></tr><tr><td><b>Date of Birth:</b></td><td>" + this.model.details.dateOfBirth + "</td></tr><tr><td><b>Nationality:</b></td><td>" + this.model.details.nationality + "</td></tr><tr><td><b>Address:</b></td><td>" + this.model.details.address + "</td></tr><tr><td><b>Wallet:</b></td><td>" + this.model.details.walletAddress + "</td></tr><tr><td><b>Amount:</b></td><td>" + this.model.details.amount + " " + this.model.details.currencyType + "</td></tr><tr><td><b>Username:</b></td><td>" + this.model.userName + "</td></tr><tr><td><b>Email:</b></td><td>" + this.model.email + "</td></tr></table></td><td style=\"text-align: center;\"> <b>Identity document (front):</b><br /><img src=\"data:image/jpg;base64," + this.model.details.passportFront + "\" style=\"width: 200px\" /></td></tr><tr><td><h4 style=\"color:#337ab7;\">KYC STATUS</h4><table class=\"table-style-one\"><tr><td><b>Overall status:</b></td><td>" + this.exportStatus + "</td></tr><tr><td><b>Comment:</b></td><td>" + this.model.status.comment + "</td></tr></table></td><td style=\"text-align: center;\"><b>Selfie:</b><br /><img src=\"data:image/jpg;base64," + this.model.details.selfie + "\" style=\"width: 150px\" /></td></tr></table><div style=\"page-break-before: always; font-size: 14px\"><b>Proof of Residence:</b><br /><div style=\"text-align: center;\"><img src=\"data:image/jpg;base64," + this.model.details.proofOfResidence + "\" style=\"width: 600px\" /></div>Report generated: " + new Date().toLocaleString() + "<div style=\"height: 20px\"></div>Powered by &nbsp;&nbsp; <img src=\"" + this.logo + "\" style=\"width: 75px;\" /></div></body></html>";
      }
    }
    this.callsService.getPdfReport(this.htmlInput).subscribe(
      data => { 
      },
      error => { 
        var binaryImg = atob(error.error.text);
        var length = binaryImg.length;
        var arrayBuffer = new ArrayBuffer(length);
        var uintArray = new Uint8Array(arrayBuffer);
        for (var i = 0; i < length; i++){
          uintArray[i] = binaryImg.charCodeAt(i);
        }
        var file = new Blob([uintArray], {type: 'application/pdf'});
        //var pdf = URL.createObjectURL(file);
        FileSaver.saveAs(file,"report.pdf");
        //window.open(pdf);
      }
    );
  }

}

