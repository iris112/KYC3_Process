import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Personal, Other } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import * as $ from 'jquery';
import {config} from '../../../../assets/configuration';
import { CallsService, AlertService } from '../../../_services';

declare var MediaRecorder: any;

/** 
 * Implements the personal step of the registering form
*/
@Component ({
    selector:     'personal'
    ,templateUrl: './personal.component.html'
})

export class PersonalComponent implements OnInit {
    title = 'Basic Information';
    personal: Personal;
    other: Other;
    form: any;
    chunks: any = [];
    captchaOk: any = false;
    companyName = config.companyName;
    captchaKey = config.captchaKey;
    captcha: any = '';
    user: any = {};

    loading: any = false;
    loadingImg: any = config.loadingImg;
    fakeEmails: any;
    fakeEmail: any = false;


    constructor(
        private router: Router, 
        private formDataService: FormDataService, 
        private callsService: CallsService, 
        private alertService: AlertService,
        private route: ActivatedRoute
    ) {
    }


    ngOnInit() {
        this.personal = this.formDataService.getPersonal();
        this.other = this.formDataService.getOther();
        this.callsService.getFakeEmails().subscribe(
            data => {
                if(data){
                    this.fakeEmails = data.split("\n");
                    //console.log(this.fakeEmails);
                }
            },
            error => {
                console.log(error);
                console.log("Unable to fetch email validator");
            }
        );
        this.route.queryParams.subscribe(
            params => {
                console.log(params);
                this.personal.email = params['email'];
            }
        );
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
    * Function used for validating the form
    * @param {any} form - form data
    * @returns {boolean} is form valid?
    */
    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }
        this.formDataService.setPersonal(this.personal);
        //this.formDataService.setOther(this.other);
        return true;
    }

    checkEmail(){
        //console.log("checkEmail called");
        var domain = this.personal.email.split("@");
        //console.log(domain[1]);
        if(domain[1] != null){
            if(this.fakeEmails.indexOf(domain[1]) != -1){
                //console.log(this.fakeEmails.indexOf(domain[1]));
                var inputs = document.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
                //console.log(inputs);
                inputs[0].setAttribute("style","border-left: 5px solid #a94442;");
                this.fakeEmail = true;
            }
            else {
                var inputs = document.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
                //console.log(inputs);
                inputs[0].setAttribute("style","border-left: 5px solid #42A948;");
                this.fakeEmail = false;
            }
        }
    }

    email: any = '';
    /** 
    * Function used for navigation
    */
    goToNext(form: any) {
        this.loading = true;
        this.captchaOk = false;
        this.user = {};
        if (this.save(form)) {
            this.user = this.formDataService.getPersonal();
            this.user.email = this.user.email.toLowerCase();
            this.callsService.createUser(this.user,this.captcha).subscribe(
                data => console.log(data),
                error => {
                    if(error){
                        console.log(error);
                        if(error.statusText == 'OK'){
                            this.loading = false;
                            //sessionStorage.setItem('email', this.personal.email);
                            this.formDataService.setRegisterState('1');
                        }
                        else if (/^Unable/.test(error.error.message)) {
                            this.loading = false;
                            this.captchaOk = true;
                            window.scroll(0,0);
                            this.alertService.error("This user already exists. Please choose a different email.");
                            var inputs = document.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
                            inputs[0].setAttribute("style","border-left: 5px solid #a94442;");
                        }
                        else {
                            this.loading = false;
                            this.captchaOk = true;
                            window.scroll(0,0);
                            this.alertService.error("Something went wrong. Please try again.");
                        }
                    }
                }
            );
          

            
            //this.formDataService.setRegisterState('1');
        }
    }
}
