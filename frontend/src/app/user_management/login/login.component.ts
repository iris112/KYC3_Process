import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { AlertService, AuthenticationService, CallsService } from '../../_services';
import { EnterpriseGuard } from '../../_guards/enterprise.guard';
import { DeviceDetectorService } from 'ngx-device-detector';

/** 
 * Implements the login page
*/
@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    response: any = {};
    admin: any = false;
    loading = false;
    returnUrl: string;
    encodedPassword: string;
    devloginUrl: string;
    deviceInfo = null;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private callsService: CallsService,
        private guard: EnterpriseGuard,
        private deviceService: DeviceDetectorService
      ) {  
    }

    ngOnInit() {
      // Make sure user is logged out
      this.authenticationService.logout();
      this.deviceInfo = this.deviceService.getDeviceInfo();
      if(this.deviceInfo.browser != "Chrome"){
        window.alert("We recommend using the Google Chrome browser to get the best experience from the KYC box.");
      }
    }

    isAdmin(){
      this.callsService.getAdmins().subscribe(
            data => {
              this.response = data;
              this.callsService.setAdminList(this.response);
              //console.log(this.response);
              var isInArray = (this.response.indexOf(localStorage.getItem('username')) > -1);
              if(isInArray == true){
                this.router.navigate(['/enterprise']);
              }
              else {
                this.router.navigate(['/account/' + this.model.userName]);
              }
            }
          );
    } 

     /** 
    * Function implementing the login process
    */
   login() {
    if(this.model.userName != null && this.model.password != null){
      this.authenticationService.login(this.model.userName, this.model.password).subscribe(
        data => {
          if (data!=null) {
            if(data.admin == true){
              this.callsService.setAdmin(true);
              this.router.navigate(['/enterprise']);
            }
            else {
              this.callsService.setAdmin(false);
              this.router.navigate(['/account/' + this.model.userName]);
            }
          } else {
            this.alertService.error("Login failed.");
          }
        },
        error => {
          this.alertService.error(error.error.message);
        }
      );
    }
    else {
      this.alertService.error("Please fill in a valid username and password.");
    }
    }

}
