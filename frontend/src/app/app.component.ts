import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AuthenticationService, CallsService} from "./_services";
import {config} from '../assets/configuration';
import {EnterpriseGuard} from './_guards/enterprise.guard';
import { map, take } from 'rxjs/operators';
import "webrtc-adapter";

/** 
* Implements the main app module
*/
@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

  _observable: Observable<any> = null;

  private apiUrl = '/api/all';
  data: any = {};
  response: any = {};
  admin: any = false;
  adminsList: any = {};
  footerText: string = config.footerText;
  web: string = config.web;
  supportEmail: string = config.supportEmail;
  companyName: string = config.companyName;
  logoPath: string = config.logoPath;
  facebook: string = config.facebook;
  linkedin: string = config.linkedin;
  telegram: string = config.telegram;
  twitter: string = config.twitter;
  mainColor: string = config.mainColor;

  constructor ( private authenticationService: AuthenticationService, private callsService: CallsService, private guard: EnterpriseGuard ) {}

  /** 
  * Function detecting if a user is logged in
  * @returns {boolean} is user logged in?
  */
  isLoggedIn() {
    var token = localStorage.getItem('auth_token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  /** 
  * Function detecting if a user is admin
  * @returns {boolean} is user admin?
  */
 isAdmin() {
  this.callsService.isAdmin.subscribe(
    message => {
      if(message == true){
        this.admin = true;
        return true;
      }
      else {
        this.admin = false;
        return false;
      };
    }
  );
}

  ngOnInit() {
    this.checkLogin();
    this.isAdmin();
  }

  /**
   * Checking whether a user is logged in
  */
  checkLogin() {
    if (localStorage.getItem("auth_token") && localStorage.getItem("auth_token").length > 0 && localStorage.getItem("expires_at") && localStorage.getItem("expires_at").length > 0) {
      var validUntilTimestamp = JSON.parse(localStorage.getItem("expires_at"));
      var currentTimestamp = Math.floor(Date.now());

      if (currentTimestamp >= validUntilTimestamp) {
        this.authenticationService.logout();
      }

      if (!(document.cookie && document.cookie.indexOf('logoutCookie') != -1)) {
        this.authenticationService.logout();
      }
    } else {
      this.authenticationService.logout();
    }
  }
}
