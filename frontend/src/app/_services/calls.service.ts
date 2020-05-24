import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

/**
 * Implements API calls to the backend.
 */
@Injectable()
export class CallsService {

  private httpOptions = {};
  private admins = new BehaviorSubject<any>(null);
  adminsList = this.admins.asObservable();
  admin = new BehaviorSubject<any>(null);
  isAdmin = this.admin.asObservable();
  formdata: FormData;
  response: any = {};
  evalFormdata: FormData;
  passwordFormdata: FormData;
  exportFormData: FormData;
  deleteFormdata: FormData;
  editFormData: FormData;
  createFormdata: FormData;
  whitelistedFormData: FormData;
  blacklistedFormData: FormData;
  moreInfoFormData: FormData;
  templateObject: any = {};

  constructor(private http: HttpClient) {
  }

  /**
   * Function to get details for the current user - including the picture files.
  */
  getDetails() {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
      return this.http.get('/api/getDetails', this.httpOptions);
  }

  payment(model: any) {
    return this.http.post('/api/payment', model);
  }

  /**
   * Function to get all users currently in database - without the picture files.
  */
  getAllUser() {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    return this.http.get('/api/getAllUser', this.httpOptions);
  }

  /**
   * Function to get details for a specific user - including the picture files.
   * @param {string} userName - username of the user we want details for.
  */
  getUserDetails(userName: string) {
      this.httpOptions = {
        params: new HttpParams().append('userName', userName),
        headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
      };
    return this.http.get('/api/getUserDetails', this.httpOptions);
  }

  /**
   * Function to get details for all users currently in database - including the picture files, may be very large.
  */
  getAllUserDetails() {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    return this.http.get('/api/getAllUserDetails', this.httpOptions);
  }

  /**
   * Function for adding a new user.
   * @param {any} user - user information such as firstname, lastname, username .... See register.component.html for details
   * @param {File} passportFront - file with the front side of an identity document
   * @param {File} passportBack - file with the back side of an identity document
   * @param {File} selfie - file with a selfie
   * @param {File} proofOfResidence - file with the proof of residence
  */
  // createUser(user: any, captcha: any) {
  //   this.formdata = new FormData();
  //   this.formdata.append('firstName', user.firstName);
  //   this.formdata.append('lastName', user.lastName);
  //   this.formdata.append('email', user.email);
  //   this.formdata.append('password', user.password);
  //   this.formdata.append('captcha', captcha);
  //   return this.http.post('/api/createUser', this.formdata);
  // }

  createUser(user: any, captcha: any){
    this.createFormdata = new FormData();
    this.createFormdata.append('email', user.email);
    this.createFormdata.append('password', user.password);
    this.createFormdata.append('captcha', captcha);
    return this.http.post('/api/createSimpleUser', this.createFormdata);
  }

  addUserDetails(email: any,user: any) {
    this.formdata = new FormData();
    var address = user.addressStreet + " " + user.addressNumber + ", " + user.addressCity + ", " + user.addressZIP + ", " + user.addressCountry;
    this.formdata.append('email', email);
    this.formdata.append('firstName', user.firstName);
    this.formdata.append('lastName',user.lastName);
    this.formdata.append('taxCountry', user.taxCountry);
    this.formdata.append('nationality', user.nationality);
    this.formdata.append('dateOfBirth', user.dateOfBirth);
    this.formdata.append('address', address);
    this.formdata.append('walletAddress', user.walletAddress);
    this.formdata.append('amount', user.amount);
    this.formdata.append('currencyType',user.currencyType);
    this.formdata.append('sourceOfFunds', user.sourceOfFunds);
    if (user.telegramName) {
      this.formdata.append('telegramName', user.telegramName);
    }
    if (user.twitterName) {
      this.formdata.append('twitterName', user.twitterName);
    }
    if (user.linkedinProfile) {
      this.formdata.append('linkedinProfile', user.linkedinProfile);
    }
    if (user.facebookProfile) {
      this.formdata.append('facebookProfile', user.facebookProfile);
    }
    // this.formdata.append('proofOfResidence', proofOfResidence);
    // this.formdata.append('selfie', selfie);
    // this.formdata.append('passportFront', passportFront);
    // if (passportBack) {
    //   this.formdata.append('passportBack', passportBack);
    // }
    return this.http.post('/api/addUserDetails', this.formdata);
  }

  addProofOfResidence(email: any, proofOfResidence: File) {
    this.formdata = new FormData();
    this.formdata.append('email', email);
    this.formdata.append('prrofOfResidence', proofOfResidence);

    // this.formdata.append('proofOfResidence', proofOfResidence);
    // this.formdata.append('selfie', selfie);
    // this.formdata.append('passportFront', passportFront);
    // if (passportBack) {
    //   this.formdata.append('passportBack', passportBack);
    // }
    return this.http.post('/api/addProofOfResidence', this.formdata);
  }

  addPassport(email: any, passFront: File, passBack: File) {
    this.formdata = new FormData();
    this.formdata.append('email', email);
    this.formdata.append('passportFront', passFront);
    if(passBack){
      this.formdata.append('passportBack', passBack);
    }

    return this.http.post('/api/addPassport', this.formdata);
  }

  addIdCard(email: any, passFront: File, passBack: File) {
    this.formdata = new FormData();
    this.formdata.append('email', email);
    this.formdata.append('passportFront', passFront);
    this.formdata.append('passportBack', passBack);

    return this.http.post('/api/addIdCard', this.formdata);
  }

  // addSelfieVideo(email: any, selfieVideo: File, wordList: any) {
  //   this.formdata = new FormData();
  //   this.formdata.append('email', email);
  //   this.formdata.append('selfieVideo', selfieVideo);
  //   this.formdata.append('wordList', wordList);

  //   return this.http.post('/api/addSelfieVideo', this.formdata);
  // }

  addVideoAuth(email: any, selfieVideo: File, wordList: any) {
    this.formdata = new FormData();
    this.formdata.append('email', email);
    this.formdata.append('selfieVideo', selfieVideo);
    this.formdata.append('wordList', wordList);

    return this.http.post('/api/addVideoAuth', this.formdata);
  }

  getSelfieBlob(blobUrl: any) {
    return this.http.get(blobUrl,{responseType: "blob" });
  }

  getWordList(email: any, numberOfWords: any){
    return this.http.get('/api/getWordList?' + 'email=' + email + '&numberOfWords=' + numberOfWords);
  }



  /**
   * Function for editing a user.
   * @param {any} user - user information such as firstname, lastname, username .... See register.component.html for details
   * @param {File} passportFront - file with the front side of an identity document
   * @param {File} passportBack - file with the back side of an identity document
   * @param {File} selfie - file with a selfie
   * @param {File} proofOfResidence - file with the proof of residence
  */
 editUser(user: any) {
  this.httpOptions = {
    headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
  };
  this.editFormData = new FormData();
  this.editFormData.append('firstName', user.firstName);
  this.editFormData.append('lastName', user.lastName);
  this.editFormData.append('userName', user.userName);
  this.editFormData.append('email', user.email);
  this.editFormData.append('password', user.password);
  this.editFormData.append('taxCountry', user.taxCountry);
  this.editFormData.append('nationality', user.nationality);
  this.editFormData.append('dateOfBirth', user.dateOfBirth);
  this.editFormData.append('address', user.address);
  this.editFormData.append('walletAddress', user.walletAddress);
  this.editFormData.append('amount', user.amount);
  this.editFormData.append('currencyType',user.currencyType);
  this.editFormData.append('sourceOfFunds', user.sourceOfFunds);
  if (user.telegramName) {
    this.editFormData.append('telegramName', user.telegramName);
  }
  if (user.twitterName) {
    this.editFormData.append('twitterName', user.twitterName);
  }
  if (user.linkedinProfile) {
    this.editFormData.append('linkedinProfile', user.linkedinProfile);
  }
  if (user.facebookProfile) {
    this.editFormData.append('facebookProfile', user.facebookProfile);
  }
  return this.http.post('/api/admin/editUserData', this.editFormData, this.httpOptions);
}


  /**
  * Function for running checks on users.
  * @param {any} userNames - array of usernames to run checks on
  */
  evalList(userNames: any) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.evalFormdata = new FormData();
    this.evalFormdata.append('userNames', userNames);
    return this.http.post('/api/risk/evalList', this.evalFormdata, this.httpOptions);
  }

  /**
  * Function for changing passwords
  * @param {any} oldPassword - old password
  * @param {any} newPassword - new password
  */
  changePassword(oldPassword: any, newPassword: any) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.passwordFormdata = new FormData();
    this.passwordFormdata.append('oldPassword', oldPassword);
    this.passwordFormdata.append('newPassword', newPassword);
    return this.http.post('/api/changePassword', this.passwordFormdata, this.httpOptions);
  }

  /** 
   * Function to save a comment in to the database
   * @param {string} comment - comment text
   * @param {string} userName - username which we want to add comment to
  */
  saveComment(comment: string, userName: string) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.evalFormdata = new FormData();
    this.evalFormdata.append('comment', comment);
    this.evalFormdata.append('userName', userName);
    return this.http.post('/api/risk/saveComment', this.evalFormdata, this.httpOptions);
  }

  /** 
   * Function to set a KYC status for a user
   * @param {string} userName - username which we want to set KYC status for
   * @param {string} kycStatus - value which we want to set (1 - Low, 2 - Medium, 3 - High)
  */
  setKYCStatus(userName: string, kycStatus: string) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.evalFormdata = new FormData();
    this.evalFormdata.append('userName', userName);
    this.evalFormdata.append('kycStatus', kycStatus);
    return this.http.post('/api/risk/setKycStatus', this.evalFormdata, this.httpOptions);
  }

  /** 
   * Function to set a identity document status for a user
  */
  setIdentityDocumentStatus(userName: string, status: string) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.evalFormdata = new FormData();
    this.evalFormdata.append('userName', userName);
    this.evalFormdata.append('status', status);
    return this.http.post('/api/risk/setIdentityDocumentStatus', this.evalFormdata, this.httpOptions);
  }

  /** 
   * Function to set a proof of residence status for a user
  */
  setProofOfResidenceStatus(userName: string, status: string) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.evalFormdata = new FormData();
    this.evalFormdata.append('userName', userName);
    this.evalFormdata.append('status', status);
    return this.http.post('/api/risk/setProofOfResidenceStatus', this.evalFormdata, this.httpOptions);
  }

  /** 
   * Function to export client dossier
   * @param {string} inputHtml - HTML to be converted to PDF
  */
  getPdfReport(inputHtml: string) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.exportFormData = new FormData();
    this.exportFormData.append('htmlInput', inputHtml);
    return this.http.post('/api/risk/getPdfReport', this.exportFormData, this.httpOptions);
  }

  /**
  * Function for deleting a user
  * @param {any} userName - username of user to delete
  */
  deleteUser(userName: any) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.deleteFormdata = new FormData();
    this.deleteFormdata.append('userName', userName);
    return this.http.post('/api/admin/deleteUser', this.deleteFormdata, this.httpOptions);
  }

  getWordForUser(email: any) {
    return this.http.get('/api/admin/getWordForUser?email=' + email);
  }

  /**
  * Function for adding an admin
  */
 createAdmin(userName: any, email: any) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.createFormdata = new FormData();
    this.createFormdata.append('adminName', userName);
    this.createFormdata.append('adminEmail', email);
    return this.http.post('/api/admin/createAdmin', this.createFormdata, this.httpOptions);
  }


 /**
  * Function for getting a list of admins
  */
 getAdmins() {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    return this.http.post('/api/getAdmins',null,this.httpOptions);
  }

  /** 
   * Function for setting the admin list observable
  */
  setAdminList(list: any){
    this.admins.next(list);
  }

  /** 
    * Function for setting the admin boolean observable
  */
  setAdmin(isAdmin: any){
    this.admin.next(isAdmin);
  }

  /**
    * Function for saving a new template
    */
  newTemplate(type:any,template: any) {
    this.templateObject = {};
    this.templateObject.template = template;
    if(type == 'REGISTRATION'){
      this.templateObject.type = 'REGISTRATION';
    }
    if(type == 'WHITELISTED'){
      this.templateObject.type = 'WHITELISTED';
    }
    if(type == 'BLACKLISTED'){
      this.templateObject.type = 'BLACKLISTED';
    }
    if(type == 'MORE_INFORMATION_NEEDED'){
      this.templateObject.type = 'MORE_INFORMATION_NEEDED';
    }
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    return this.http.post('/api/customEmail/newTemplate',this.templateObject,this.httpOptions);
  }


  /**
    * Function for setting up mail server
    */
   mailServer(mailServer: any) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    return this.http.post('/api/customEmail/mailServer',mailServer,this.httpOptions);
  }

  /**
  * Function for whitelisting a user
  */
  whitelisted(userName: any) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
    };
    this.whitelistedFormData = new FormData();
    this.whitelistedFormData.append('userName', userName);
    return this.http.post('/api/whitelisted', this.whitelistedFormData, this.httpOptions);
  }

  /**
  * Function for blacklisting a user
  */
 blacklisted(userName: any) {
  this.httpOptions = {
    headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
  };
  this.blacklistedFormData = new FormData();
  this.blacklistedFormData.append('userName', userName);
  return this.http.post('/api/blacklisted', this.blacklistedFormData, this.httpOptions);
 }

  /**
  * Function for requesting more information from a user
  */
 moreInformationNeeded(userName: any) {
  this.httpOptions = {
    headers: new HttpHeaders({ 'X-Auth-Token': JSON.parse(localStorage.getItem('auth_token')) })
  };
  this.moreInfoFormData = new FormData();
  this.moreInfoFormData.append('userName', userName);
  return this.http.post('/api/moreInformationNeeded', this.moreInfoFormData, this.httpOptions);
}

faceMatch(email: any){
  this.formdata = new FormData();
  this.formdata.append('email', email);
  return this.http.post('/api/faceMatch', this.formdata);
}

getFakeEmails() {
  return this.http.get('https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable_email_blocklist.conf',{responseType: 'text'});
}

getCurrentEURPrices() {
  return this.http.get('https://api.coinbase.com/v2/prices/ETH-EUR/spot');
}

getCurrentUSDPrices() {
  return this.http.get('https://api.coinbase.com/v2/prices/ETH-USD/spot');
}



  // sendMessage(fromName: string, toName: string, text: string) {
  //   this.httpOptions = {
  //     params: new HttpParams().append('fromName', fromName)
  //     .append('toName',toName)
  //     .append('text', text)
  //   };
  // return this.http.get('/api/sendMessage', this.httpOptions);
  // }

  // getMessagesForUser(userName: string) {
  //   this.httpOptions = {
  //     params: new HttpParams().append('userName', userName)
  //   };
  // return this.http.get('/api/getMessagesForUser', this.httpOptions);
  // }

  // muteUser(userName: string) {
  //   this.httpOptions = {
  //     params: new HttpParams().append('userName', userName)
  //   };
  // return this.http.get('/api/muteUser', this.httpOptions);
  // }

  // getIP() {
  //   return this.http.get('https://jsonip.com');
  // }

  // getGeolocation(ipAddress: any) {
  //   return this.http.get('https://ipinfo.io/' + ipAddress);
  // }
}
