import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallsService } from '../../_services';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { config } from '../../../assets/configuration';

/** 
 * Implements the user account page
*/
@Component({
    moduleId: module.id,
    templateUrl: 'account.component.html',
    styleUrls: [ './account.component.css' ]
})

export class AccountComponent {
  
  model: any = {};
  loading = false;
  loadingImg = "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";
  progress: number = 22;
  username = "";
  response: any = {};
  safeSelfie: SafeResourceUrl;
  safePassportFront: SafeResourceUrl;
  safePassportBack: SafeResourceUrl;
  safeProofOfResidence: SafeResourceUrl;
  slideIndex: number = 1;
  changePasswordClicked: any = false;
  mainColor: any = config.mainColor;

  constructor (
    private callsService: CallsService,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ){
    this.route.params.subscribe(
      params => {
        if(params.username){
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
   * Function implementing the picture gallery navigation
  */
  plusDivs(n) {
    this.showDivs(this.slideIndex += n);
  }

  /** 
   * Function implementing the picture gallery navigation
  */
  showDivs(n) {
    var i;
    var x = (document.getElementsByClassName("uploadedImages") as HTMLCollectionOf<HTMLElement>) ;
    if (n > x.length) {this.slideIndex = 1} 
    if (n < 1) {this.slideIndex = x.length} ;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none"; 
    }
    x[this.slideIndex-1].style.display = "block"; 
  }
  
  /** 
   * Function for getting the user details
  */
  getAccount() {
    this.callsService.getDetails().subscribe(
      data => { 
        this.model = data;
        this.safeSelfie = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.model.details.selfie);
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
   * Function for "Settings" toggle button
  */
  changePasswordButton(){
    if (this.changePasswordClicked == false){
      this.changePasswordClicked = true;
    }
    else this.changePasswordClicked = false;
  }

}

