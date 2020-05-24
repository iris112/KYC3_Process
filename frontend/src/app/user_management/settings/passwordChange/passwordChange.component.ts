import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CallsService, AuthenticationService } from '../../../_services';
import { config } from '../../../../assets/configuration';

/** 
* Implements password changing directive
*/
@Component({
    moduleId: module.id,
    selector: 'password-change',
    templateUrl: 'passwordChange.component.html',
    styleUrls: [ './passwordChange.component.css' ]
})

export class PasswordChangeComponent {

  oldPassword: string = '';
  newPassword: string = '';
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
  async changePassword(form: any) {
    this.callsService.changePassword(this.oldPassword,this.newPassword).subscribe(
      data => { 
      },
      error => {
        if (error.status == '200' && (/^Couldn/.test(error.error.text)==false)){ 
          if(confirm("Password changed successfully. Please log in with the new credentials.")){
            this.authenticationService.logout();
            this.router.navigate(['login']);
          }
          else {
            this.authenticationService.logout();
            this.router.navigate(['login']);
          }
        }
        else {
          this.alertService.error(error.error.text);
        }
      }
    );
  }


}

