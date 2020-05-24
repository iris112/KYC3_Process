import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CallsService, AuthenticationService } from '../../../_services';
import { config } from '../../../../assets/configuration';

/** 
* Implements password changing directive
*/
@Component({
    moduleId: module.id,
    selector: 'create-admin',
    templateUrl: 'createAdmin.component.html',
    styleUrls: [ './createAdmin.component.css' ]
})

export class CreateAdminComponent {

  userName: string = '';
  email: string = '';
  response: any = {};
  mainColor: any = config.mainColor;

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
  async createAdmin(form: any) {
    this.callsService.createAdmin(this.userName,this.email).subscribe(
      data => { 
        if (data != null){
          this.response = data;
          if(this.response.password != null){
            this.alertService.success("Admin created successfully. Password is <b>" + this.response.password + "</b>");
            this.userName = '';
            this.email = '';
          }
          else {
            this.alertService.error("Something went wrong.");
          }
        }
      },
      error => {
        this.alertService.error(error.error.message);
      }
    );
  }


}

