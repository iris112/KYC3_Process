import { Component, OnInit }   from '@angular/core';
import { Router } from '@angular/router';
import { CallsService } from '../../../_services/calls.service'
import { FormDataService } from '../data/formData.service';
import { Disclaimers } from '../data/formData.model';
import { AlertService } from '../../../_services';
import { config } from '../../../../assets/configuration';

/** 
 * Implements the disclaimers (final) step of the registering form
*/
@Component ({
    selector:     'disclaimers'
    ,templateUrl: './disclaimers.component.html'
})

export class DisclaimersComponent implements OnInit {
    title = 'Disclaimers';
    disclaimers: Disclaimers;
    form: any;
    formData: any;
    loading: any = false;
    loadingImg = "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";
    captchaOk: any = false;
    companyName = config.companyName;
    captchaKey = config.captchaKey;
    captcha: any = '';
    
    constructor(private router: Router, private formDataService: FormDataService, private callsService: CallsService, private alertService: AlertService) {
    }

    ngOnInit() {
        this.disclaimers = this.formDataService.getDisclaimers();
    }

    /** 
    * Function used for validating the form
    * @param {any} form - form data
    * @returns {boolean} is form valid?
    */
    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }
        this.formDataService.setDisclaimers(this.disclaimers);
        return true;
    }

    /** 
    * Function used to catch the successful reCAPTCHA event
    */
    resolved(captchaResponse: string){
        //console.log(`Resolved captcha with response ${captchaResponse}:`);
        this.captcha = captchaResponse;
        //console.log("captcha >>>>" + this.captcha);
        this.captchaOk = true;
    }

    /** 
    * Function used for navigation
    */
    goToPrevious(form: any) {
        this.formDataService.setRegisterState('3');
    }

    /** 
    * Function used to check all disclaimer checkboxes
    */
    checkAll(){
        (document.getElementById("onOwnBehalf") as HTMLInputElement).checked = true;
        this.disclaimers.onOwnBehalf = true;
        (document.getElementById("nonUs") as HTMLInputElement).checked = true;
        this.disclaimers.nonUs = true;
        (document.getElementById("nonChinese") as HTMLInputElement).checked = true;
        this.disclaimers.nonChinese = true;
        (document.getElementById("conditionsAgreement") as HTMLInputElement).checked = true;
        this.disclaimers.conditionsAgreement = true;
        (document.getElementById("fullAndFactual") as HTMLInputElement).checked = true;
        this.disclaimers.fullAndFactual = true;
        (document.getElementById("exclusionStatement") as HTMLInputElement).checked = true;
        this.disclaimers.exclusionStatement = true;
        (document.getElementById("nonFATF") as HTMLInputElement).checked = true;
        this.disclaimers.nonFATF = true;
        (document.getElementById("acceptanceOfRiskDisclaimer") as HTMLInputElement).checked = true;
        this.disclaimers.acceptanceOfRiskDisclaimer = true;
    }

    /** 
    * Function used to submit the registration form
    */
    submit(form: any) {
        this.loading = true;
        if (this.save(form)) {
            this.alertService.success("Registration successful");
            window.alert("Registration successful, you will be redirected to the login page.");
            window.location.href = "/login";
        //     this.formData = this.formDataService.getFormData();
        //     //console.log(this.formData);
        //     const date = new Date(this.formData.dateOfBirth);
        //     this.formData.dateOfBirth = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' +  ('0' + date.getDate()).slice(-2);
        //     this.callsService.addUser(this.formData,this.formData.passportFront,this.formData.passportBack,this.formData.selfie,this.formData.proofOfResidence, this.captcha).subscribe(
        //             data => {
        //               if (data!=null) {
        //                 //console.log("data not null");
        //                 this.loading = false;
        //                 this.router.navigate(['/login']);
        //               } else {
        //                 //console.log("data null");
        //               }
        //             },
        //             error => {
        //               if(error.error.text == "Success"){
        //                 this.formDataService.resetFormData();
        //                 this.loading = false;
        //                 this.router.navigate(['/login']);
        //                 this.alertService.success("Registration successful");
        //               }
        //               else {
        //                 this.loading = false;
        //                 this.alertService.error(error.error.text);
        //               }
        //             }
        //           );
        //         }
        // else {
        //     this.loading = false;
        //     this.alertService.error("You must fill in all information to submit");
        // }
        }
    }
}
