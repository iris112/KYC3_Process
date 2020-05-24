import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CallsService, AuthenticationService } from '../../../_services';

/** 
* Implements password changing directive
*/
@Component({
    moduleId: module.id,
    selector: 'email-server',
    templateUrl: 'emailServer.component.html',
    styleUrls: [ './emailServer.component.css' ]
})

export class EmailServerComponent {

  response: any = {};
  mailServer: any = {};


  constructor (
    private router: Router,
    private callsService: CallsService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
  
  }

  /** 
  * Function used for changing the password
  */
  async saveServer(form: any) {
    console.log(this.mailServer);
    // this.callsService.mailServer(this.mailServer);
    // this.callsService.createAdmin(this.userName,this.email).subscribe(
    //   data => { 
    //     if (data != null){
    //       this.response = data;
    //       if(this.response.password != null){
    //         this.alertService.success("Admin created successfully. Password is <b>" + this.response.password + "</b>");
    //         this.userName = '';
    //         this.email = '';
    //       }
    //       else {
    //         this.alertService.error("Something went wrong.");
    //       }
    //     }
    //   },
    //   error => {
    //     this.alertService.error(error.error.message);
    //   }
    // );
  }


}

