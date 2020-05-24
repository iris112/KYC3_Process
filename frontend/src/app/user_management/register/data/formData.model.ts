/** 
* Model for the registration form
*/
export class FormData {
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    dateOfBirth: string = '';
    addressStreet: string = '';
    addressNumber: string = '';
    addressZIP: string = '';
    addressCity: string = '';
    addressCountry: string = '';
    taxCountry: string = '';
    nationality: string = '';
    password: string = '';
    password_confirm: string = '';
    walletAddress: string = '';
    amount: string = '';
    currencyType: string = '';
    sourceOfFunds: string = '';
    passportFront: File = null;
    passportBack: File = null;
    selfie: File = null;
    proofOfResidence: File = null;
    telegramName: string = '';
    twitterName: string = '';
    linkedinProfile: string = '';
    facebookProfile: string = '';
    onOwnBehalf: boolean = false;
    nonUs: boolean = false;
    nonChinese: boolean = false;
    conditionsAgreement: boolean = false;
    fullAndFactual: boolean = false;
    exclusionStatement: boolean = false;
    nonFATF: boolean = false;
    acceptanceOfRiskDisclaimer: boolean = false;

    clear() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.dateOfBirth = '';
        this.addressStreet = '';
        this.addressNumber = '';
        this.addressZIP = '';
        this.addressCity = '';
        this.addressCountry = '';
        this.taxCountry = '';
        this.nationality = '';
        this.password = '';
        this.password_confirm = '';
        this.walletAddress = '';
        this.amount = '';
        this.currencyType = '';
        this.sourceOfFunds = '';
        this.passportFront = null;
        this.passportBack = null;
        this.selfie = null;
        this.proofOfResidence = null;
        this.telegramName = '';
        this.twitterName = '';
        this.linkedinProfile= '';
        this.facebookProfile = '';
        this.onOwnBehalf = false;
        this.nonUs = false;
        this.nonChinese = false;
        this.conditionsAgreement = false;
        this.fullAndFactual = false;
        this.exclusionStatement = false;
        this.nonFATF = false;
        this.acceptanceOfRiskDisclaimer = false;
    }
}

/** 
* Model for the registration form - personal section
*/
export class Personal {
    email: string = '';
    password: string = '';
    password_confirm: string = '';
}

/** 
* Model for the registration form - address section
*/
export class Other {
    firstName: string = '';
    lastName: string = '';
    dateOfBirth: string = '';
    nationality: string = '';
    addressStreet: string = '';
    addressNumber: string = '';
    addressZIP: string = '';
    addressCity: string = '';
    addressCountry: string = '';
    proofOfResidence: File = null;
    taxCountry: string = '';
    telegramName: string = '';
    twitterName: string = '';
    linkedinProfile: string = '';
    facebookProfile: string = '';
    walletAddress: string = '';
    amount: string = '';
    currencyType: string = '';
    sourceOfFunds: string = '';
}

/** 
* Model for the registration form - documents section
*/
export class Documents {
    passportFront: File = null;
    passportBack: File = null;
    selfie: File = null;
}

/** 
* Model for the registration form - disclaimers section
*/
export class Disclaimers {
    onOwnBehalf: boolean = false;
    nonUs: boolean = false;
    nonChinese: boolean = false;
    conditionsAgreement: boolean = false;
    fullAndFactual: boolean = false;
    exclusionStatement: boolean = false;
    nonFATF: boolean = false;
    acceptanceOfRiskDisclaimer: boolean = false;
}