import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'

/** 
 * Implements authentication functions
*/
@Injectable()
export class AuthenticationService {

    constructor(
      private http: HttpClient,
      private router: Router
    ) { 
    }

    /** 
      * Function that creates a cookie
      * @param {String} cookieName - name of the cookie
      * @param {String} cookieNameValue - value of the cookie
      * @param {number} expiresinSecs - expiration time of cookie in seconds
    */
    setCookie(cookieName: string, cookienameValue: string, expiresinSecs: number){
      var now = new Date();
      var exp = new Date(now.getTime() + expiresinSecs*1000);
      document.cookie = cookieName + '=' + cookienameValue + '; expires=' + exp.toUTCString();
      //console.log("Cookie has been set");
    }

    /** 
      * Function that deletes a cookie
      * @param {String} cookieName - name of the cookie to be deleted
      * @param {String} cookieNameValue - value of the cookie to be deleted
    */
    deleteCookie(cookieName: string, cookienameValue: string){
      document.cookie = cookieName + '=' + cookienameValue + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    } 
    
    /** 
      * Function for logging in
      * @param {String} username - username of the user
      * @param {String} password - password of the user
    */
    login(username: string, password: string) {
      return this.http.post<any>('/api/auth', { username: username, password: password })
        .map(auth => {
          // login successful if there's a jwt token in the response
          if (auth && auth.token) {
            // store auth details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('auth_token', JSON.stringify(auth.token));
            localStorage.setItem('expires_at', JSON.stringify(auth.validUntilTimestamp));
            localStorage.setItem('username', username);

            this.setCookie("logoutCookie",auth.token,3600);
            return auth;
          }
        });
    }

    /** 
      * Function for logging out
    */
    logout() {
      var logout = false;

      // remove user from local storage to log user out
      if (localStorage.getItem("auth_token") && localStorage.getItem("auth_token").length > 0) {
        localStorage.removeItem('auth_token');
        logout = true;
      }

      // remove expires-at
      if (localStorage.getItem("expires_at") && localStorage.getItem("expires_at").length > 0) {
        localStorage.removeItem('expires_at');
        logout = true;
      }

      // remove username
      if (localStorage.getItem("username") && localStorage.getItem("username").length > 0) {
        localStorage.removeItem('username');
        logout = true;
      }

      // remove logout cookie
      if(document.cookie && document.cookie.indexOf('logoutCookie') != -1){
        this.deleteCookie("logoutCookie",localStorage.getItem("auth_token"));
        logout = true;
      }

      // redirect to login page
      if (logout) {
        this.router.navigate(['/login']);
      }

    }
}
