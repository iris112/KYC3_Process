import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormDataService } from '../data/formData.service';
import { Other } from '../data/formData.model';
import { AlertService, CallsService, DataService } from '../../../_services';
import { config } from '../../../../assets/configuration';

/** 
 * Implements the "other" step of the registering form
*/
@Component ({
    selector:     'other'
    ,templateUrl: './other.component.html'
})

export class OtherComponent implements OnInit {
    title = 'Additional Information';
    other: Other;
    form: any;
    currencyFilled: any = false;
    currency: any = '';
    addressCountryFilled: any = false;
    taxCountryFilled: any = false;
    proofOfResidenceFilled: any = false;
    porFormat: any = true;
    nationalityFilled: any = false;
    nationality: any;
    minDate: Date;
    maxDate: Date;
    user: any = {};
    loading: any = false;
    loadingImg: any = config.loadingImg;
    isocountries: any = config.isocountries;
    nationalities: any = config.nationalities;
    formOk: any = true;
    
    
    constructor(private formDataService: FormDataService, private route: ActivatedRoute,private alertService: AlertService, private callsService: CallsService, private dataService: DataService) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate()-42705);
        this.maxDate.setDate(this.maxDate.getDate()-6570);
    }

    ngOnInit() {
        this.other = this.formDataService.getOther();
        // ensuring that the validations are set correctly if the person came from a different step of the form
        this.route.queryParams.subscribe(
            params => {
                this.other.walletAddress = params['walletAddress'];
                this.other.amount = params['tokensNo'];
                console.log(params);
                console.log(this.other.walletAddress);
                console.log(this.other.amount);
            }
        );
        this.formDataService.isPreviousDocumentsClicked.subscribe(
            message => {
                if(message){
                    if(message == true){
                        this.currencyFilled = true;
                        this.currency = this.formDataService.getOther().currencyType;
                    }
                }
            }
        );
        this.formDataService.isPreviousOtherClicked.subscribe(
            message => {
                if(message){
                    if(message == true){
                        this.addressCountryFilled = true;
                        this.taxCountryFilled = true;
                    }
                }
            }
        );
        this.dataService.mrzData.subscribe(
            message => {
                console.log("Data is:");
                console.log(message);
                if(message){
                    if(message.DateOfBirth != '' && message.DateOfBirth != null){
                        var dob = message.DateOfBirth.split("-");
                        this.other.dateOfBirth = dob[2] + "/" + dob[1] + "/" + dob[0];
                        console.log("Date of birth");
                        console.log(this.other.dateOfBirth);
                        //this.other.dateOfBirth = message.dateOfBirth;
                    }
                    if(message.GivenName != '' && message.GivenName != null){
                        this.other.firstName = message.GivenName;
                    }
                    if(message.Surname != '' && message.Surname != null){
                        this.other.lastName = message.Surname;
                    }
                    if(message.IssuingCountry != '' && message.IssuingCountry != null){
                        for(var i = 0; i < this.isocountries.length; i++){
                            if(this.isocountries[i].alpha_3_code == message.IssuingCountry){
                                var country = this.isocountries[i].alpha_2_code;
                                this.nationality = [country];                        
                            }
                        }
                    }
                }
            }
        );
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
        if(this.nationality){
            this.other.nationality = this.nationality.join();
        }
        var re = /image\/((png)|(jpeg))/;
        this.addressCountryFilled = true;
        this.taxCountryFilled = true;
        if (this.other.proofOfResidence){
            if((!re.test(this.other.proofOfResidence.type))){
                this.alertService.error("Proof of residence must be in .jpg,.jpeg or .png format");
                this.porFormat = false;
                return false;
            }
        }
        this.formDataService.setOther(this.other);
        return true;
    }

    /** 
    * Function used for detecting if nationality is filled
    */
    isNationalityFilled(){
     this.nationalityFilled = true;
    }
    
    testPorFormat(){
        var re = /image\/((png)|(jpeg))/;
        if((!re.test(this.other.proofOfResidence.type))){
            this.alertService.error("Proof of residence must be in .jpg,.jpeg or .png format");
            this.porFormat = false;
            var input = document.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
            input[10].setAttribute("style","border-left: 5px solid #a94442;");
            return false;
        }
        else {
            var input = document.getElementsByTagName("input") as HTMLCollectionOf<HTMLInputElement>;
            input[10].setAttribute("style","border-left: 5px solid #42A948;");
            return true
        };
    }
    /** 
    * Function used for navigation
    */
    goToPrevious(form: any) {
        this.formDataService.setRegisterState('2');
        this.formDataService.setPreviousOtherClicked(true);
    }

    email: any = '';

    /** 
    * Function used for navigation
    */
    goToNext(form: any) {
        this.loading = true;
        this.formOk = false;
        this.user = {};
        if (this.save(form)) {
            this.user = this.formDataService.getOther();
            this.email = this.formDataService.getPersonal().email;
            this.user.firstName = this.user.firstName.toUpperCase();
            this.user.lastName = this.user.lastName.toUpperCase();
            //var slash = this.user.dateOfBirth.charAt(2);
            if(typeof this.user.dateOfBirth == "object"){
                const date = new Date(this.user.dateOfBirth);
                this.user.dateOfBirth = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
            }
            this.callsService.addUserDetails(this.email,this.user).subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    console.log(error);
                    if(error){
                        if(error.statusText == 'OK'){
                            this.callsService.addProofOfResidence(this.email,this.user.proofOfResidence).subscribe(
                                data => console.log(data),
                                error => {
                                    if(error){
                                        if(error.statusText == 'OK'){
                                            this.loading = false;
                                            this.formDataService.setRegisterState('4');
                                        }
                                        else {
                                            this.loading = false;
                                            this.formOk = true;
                                            this.alertService.error("An error occured. Please revise your proof of residence.");
                                        }
                                    }
                                }
                            );
                        }
                        else {
                            this.alertService.error("An error occured. Please revise your additional details.");
                        }
                    }
                }
            );
            //console.log(this.user.proofOfResidence);
        }
    }


    /** 
    * Function used for detecting if residence country address is filled
    */
    isAddressCountryFilled(){
        this.addressCountryFilled = true;
    }   

    /** 
    * Function used for detecting if tax country address is filled
    */
    isTaxCountryFilled(){
        this.taxCountryFilled = true;
    }

    /** 
    * Function used to detect whether currency has been chosen
    */
    isCurrencyFilled(){
        this.currencyFilled = true;
        if (this.other.currencyType == 'EUR' || this.other.currencyType == 'USD' ) {
            this.currency = '';
        }
        else {
            this.currency = this.other.currencyType;
        } 
        this.other.walletAddress = '';
        //console.log("currency" + this.currency);
        //console.log("currencyType" + this.other.currencyType);
    }

    /** 
    * Function used for processing the proof of residence
    * @param {FileList} files - input file
    */
    processProofOfResidence(files: FileList) {
        //console.log(files.item(0));
        this.proofOfResidenceFilled = true;
        this.other.proofOfResidence = files.item(0);
        this.testPorFormat();

    }
}