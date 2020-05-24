import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AlertService, CallsService, AuthenticationService} from '../_services/index';

/** 
 * Implements guard preventing unauthorized user access to the admin pages
*/
@Injectable()
export class EnterpriseGuard implements CanActivate {

  response: any = {};

  constructor(private router: Router, private callsService: CallsService, private authenticationService: AuthenticationService, private alertService: AlertService) { }


  canActivate(routeSnapshot: ActivatedRouteSnapshot) {
    if (localStorage.hasOwnProperty('auth_token') && localStorage.getItem('auth_token').length > 0) {
      console.log(this.callsService.admin.getValue());
      if(this.callsService.admin.getValue() == true){
        return true;
      }
      else {
        window.alert('You are not authorized to access this URL.');
        this.authenticationService.logout();
        return false;
      }      
    }
    else {
      window.alert('You are not authorized to access this URL.');
      this.authenticationService.logout();
      return false;
    };
  }


}


