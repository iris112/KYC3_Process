import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

/** 
 * Implements guard preventing unauthorized access to another user's account page
*/
@Injectable()
export class UsernameGuard {

    
    constructor(private router: Router) { 
    }

    /** 
      * Function deciding whether the user should be let through or not (is logged in, username is equal to the one in the URL)
      * @returns {boolean} can user activate this URL?
    */
    canActivate(route: ActivatedRouteSnapshot) {
      if (route.params.username == localStorage.getItem('username')){
        return true;
      }
      else {
        window.alert('You are not authorized to access this URL.');
        this.router.navigate(['/account/' + localStorage.getItem('username')]);
        return false;
      }
    }

}

