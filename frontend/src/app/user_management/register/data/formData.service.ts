import { Injectable } from '@angular/core';
import { FormData, Personal, Other, Documents, Disclaimers } from './formData.model';
import { BehaviorSubject } from 'rxjs';

/** 
* Implements service for dealing with registration form data. Includes getters and setters.
*/
@Injectable()
export class FormDataService {

    private formData: FormData = new FormData();
    private isPersonalFormValid: boolean = false;
    private isOtherFormValid: boolean = false;
    private isDocumentsFormValid: boolean = false;
    private isDisclaimersFormValid: boolean = false;
    private registerState = new BehaviorSubject<any>(null);
    private previousOtherClicked = new BehaviorSubject<any>(null);
    private previousDocumentsClicked = new BehaviorSubject<any>(null);


    currentRegisterState = this.registerState.asObservable();
    isPreviousOtherClicked = this.previousOtherClicked.asObservable();
    isPreviousDocumentsClicked = this.previousDocumentsClicked.asObservable();

    constructor() {}

    /** 
    * Setter for registration form work flow
    */
    setRegisterState(registerState: any){
        this.registerState.next(registerState);
    }

    /** 
    * Setter for detection of 'Previous' button click on Other page
    */
    setPreviousOtherClicked(previousOtherClicked: boolean){
        this.previousOtherClicked.next(previousOtherClicked);
    }

    /** 
    * Setter for detection of 'Previous' button click on Documents page
    */
    setPreviousDocumentsClicked(previousDocumentsClicked: boolean){
        this.previousDocumentsClicked.next(previousDocumentsClicked);
    }

    /** 
    * Getter for personal information
    * @returns {Personal} personal
    */
    getPersonal(): Personal {
        var personal: Personal = {
            email: this.formData.email,
            password: this.formData.password,
            password_confirm: this.formData.password_confirm
        };
        return personal;
    }

    /** 
    * Setter for personal information
    */
    setPersonal(data: Personal) {
        this.isPersonalFormValid = true;
        this.formData.email = data.email;
        this.formData.password = data.password;
        this.formData.password_confirm = data.password_confirm
    }

    /** 
    * Getter for other information
    * @returns {Other} other
    */
    getOther(): Other {
        var other: Other = {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            addressStreet: this.formData.addressStreet,
            addressNumber: this.formData.addressNumber,
            addressZIP: this.formData.addressZIP,
            addressCity: this.formData.addressCity,
            addressCountry: this.formData.addressCountry,
            proofOfResidence: this.formData.proofOfResidence,
            taxCountry: this.formData.taxCountry,
            dateOfBirth: this.formData.dateOfBirth,
            nationality: this.formData.nationality,
            telegramName: this.formData.telegramName,
            twitterName: this.formData.twitterName,
            linkedinProfile: this.formData.linkedinProfile,
            facebookProfile: this.formData.facebookProfile,
            walletAddress: this.formData.walletAddress,
            amount: this.formData.amount,
            currencyType: this.formData.currencyType,
            sourceOfFunds: this.formData.sourceOfFunds,
        };
        return other;
    }

    /** 
    * Setter for other information
    */
    setOther(data: Other) {
        this.isOtherFormValid = true;
        this.formData.firstName = data.firstName;
        this.formData.lastName = data.lastName;
        this.formData.addressStreet = data.addressStreet;
        this.formData.addressNumber = data.addressNumber;
        this.formData.addressZIP = data.addressZIP;
        this.formData.addressCity = data.addressCity;
        this.formData.addressCountry = data.addressCountry;
        this.formData.dateOfBirth = data.dateOfBirth
        this.formData.nationality = data.nationality;
        this.formData.proofOfResidence = data.proofOfResidence;
        this.formData.taxCountry = data.taxCountry;
        this.formData.telegramName = data.telegramName;
        this.formData.twitterName = data.twitterName;
        this.formData.linkedinProfile = data.linkedinProfile;
        this.formData.facebookProfile = data.facebookProfile;
        this.formData.walletAddress = data.walletAddress;
        this.formData.amount = data.amount;
        this.formData.currencyType = data.currencyType;
        this.formData.sourceOfFunds = data.sourceOfFunds;
    }

    /** 
    * Getter for documents
    * @returns {Documents} documents
    */
    getDocuments(): Documents {
        var documents: Documents = {
            passportFront: this.formData.passportFront,
            passportBack: this.formData.passportBack,
            selfie: this.formData.selfie
        };
        return documents;
    }

    /** 
    * Setter for documents
    */
    setDocuments(data: Documents) {
        this.isDocumentsFormValid = true;
        this.formData.passportFront = data.passportFront;
        this.formData.passportBack = data.passportBack;
        this.formData.selfie = data.selfie;
    }

    /** 
    * Getter for disclaimers
    * @returns {Disclaimers} disclaimers
    */
    getDisclaimers(): Disclaimers {
        var disclaimers: Disclaimers = {
            onOwnBehalf: this.formData.onOwnBehalf,
            nonUs: this.formData.nonUs,
            nonChinese: this.formData.nonChinese,
            conditionsAgreement: this.formData.conditionsAgreement,
            fullAndFactual: this.formData.fullAndFactual,
            exclusionStatement: this.formData.exclusionStatement,
            nonFATF: this.formData.nonFATF,
            acceptanceOfRiskDisclaimer: this.formData.acceptanceOfRiskDisclaimer
        };
        return disclaimers;
    }

    /** 
    * Setter for disclaimers
    */
    setDisclaimers(data: Disclaimers) {
        this.isDisclaimersFormValid = true;
        this.formData.onOwnBehalf = data.onOwnBehalf;
        this.formData.nonUs = data.nonUs;
        this.formData.nonChinese = data.nonChinese;
        this.formData.conditionsAgreement = data.conditionsAgreement;
        this.formData.fullAndFactual = data.fullAndFactual;
        this.formData.exclusionStatement = data.exclusionStatement;
        this.formData.nonFATF = data.nonFATF;
        this.formData.acceptanceOfRiskDisclaimer = data.acceptanceOfRiskDisclaimer;
    }

    /** 
    * Getter for entire form data
    * @returns {FormData} form data
    */
    getFormData(): FormData {
        return this.formData;
    }

    /** 
    * Function for resetting form data and validators
    */
    resetFormData(): FormData {
        this.formData.clear();
        this.isPersonalFormValid = this.isOtherFormValid = this.isDocumentsFormValid = this.isDisclaimersFormValid = false;
        return this.formData;
    }

    /** 
    * Function for form data validation
    * @returns {boolean} is form valid
    */
    isFormValid() {
        return this.isPersonalFormValid &&
                this.isOtherFormValid && 
                this.isDocumentsFormValid &&
                this.isDisclaimersFormValid;
    }
}