import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

/**
 * Implements service for displaying alerts
 */
@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    
    /**
     * Function for success alert
     * @param {string} message - message you want to display
     * @param keepAfterNavigationChange - making the message persistent or not
     */    
    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    /**
     * Function for error alert
     * @param {string} message - message you want to display
     * @param keepAfterNavigationChange - making the message persistent or not
     */   
    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    }

    /**
     * Function for getting a message
     */   
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    /**
     * Function for parsing the error message
     * @param {object} error - error object 
     */   
    showMessageError(error: object) {
      var messageError = "";
      if (error["error"] && error["error"].fieldErrors) {
        error["error"].fieldErrors.forEach((element, index, array) => {
          messageError += element.message + "\n";
        });
      } else if (error["error"] && error["error"].messages) {
        error["error"].messages.forEach((element, index, array) => {
          messageError += element.message + "\n";
        });
      } else {
        messageError = "Something went wrong. Please try again.";
      }
      return messageError;
    }

}
