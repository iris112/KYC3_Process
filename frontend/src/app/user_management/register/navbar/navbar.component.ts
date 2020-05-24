import { Component } from '@angular/core';
import { FormDataService } from '../data/formData.service';

/** 
 * Implements the navigation bar of the registering form
*/
@Component ({
    selector: 'register-navbar'
    ,templateUrl: './navbar.component.html'
})

export class NavbarComponent {
    registerState:  any = '';

    constructor(private formDataService: FormDataService){}

    ngOnInit(){
     this.formDataService.currentRegisterState.subscribe(message => this.registerState = message);
     //console.log("Navbar register state" + this.registerState);        
    }

    /** 
    * Function used for nagivation
    * @param {any} state - the step in the form we want to go to
    */
    setRegisterState(state: any){
        //("Set register state called");
        this.formDataService.setRegisterState(state);
    }
}

