import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Personal } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import * as $ from 'jquery';
import { config } from '../../../../assets/configuration';
import { CallsService, AlertService, DataService } from '../../../_services';
import { saveAs } from 'file-saver';
import {DeviceDetectorService} from 'ngx-device-detector';

declare var MediaRecorder: any;

/** 
 * Implements the personal step of the registering form
*/
@Component ({
    selector:     'identityDocument'
    ,templateUrl: './identityDocument.component.html'
})

export class IdentityDocumentComponent implements OnInit, AfterViewInit {

    title = 'Identity Document Photo';
    personal: Personal;
    form: any;
    nationalityFilled: any = false;
    nationality: any = '';
    minDate: Date;
    maxDate: Date;
    chunks: any = [];
    loading: any = false;
    loadingImg: any = config.loadingImg;
    documentType: any = '';
    identityDocument: any = '';
    text: String;
    documentOk: any = false;
    passportFront: File;
    passportBack: File;
    response: any = {};

    @HostListener('document:keyup.enter',['$event'])
    onKeyupHandler(event: KeyboardEvent) {
       this.capture(this.documentType);
    }

    @ViewChild("idVideo")
    public idVideo: ElementRef;

    @ViewChild("driversVideo")
    public driversVideo: ElementRef;

    @ViewChild("passportVideo")
    public passportVideo: ElementRef;

    @ViewChild("idCanvas")
    public idCanvas: ElementRef;

    @ViewChild("driversCanvas")
    public driversCanvas: ElementRef;

    @ViewChild("passportCanvas")
    public passportCanvas: ElementRef;

    captures: any = [];
    passportCapture: any ='';
    passportCaptured: any = false;
    passportStream: any;
    idStream: any;
    isMobile: any = false;

    
    nationalities = [{"value":"AF","label":"Afghan"},{"value":"AL","label":"Albanian"},{"value":"DZ","label":"Algerian"},{"value":"AS","label":"American Samoan"},{"value":"AD","label":"Andorran"},{"value":"AO","label":"Angolan"},{"value":"AI","label":"Anguillan"},{"value":"AQ","label":"Antarctic"},{"value":"AG","label":"Antiguan or Barbudan"},{"value":"AR","label":"Argentine"},{"value":"AM","label":"Armenian"},{"value":"AW","label":"Aruban"},{"value":"AU","label":"Australian"},{"value":"AT","label":"Austrian"},{"value":"AZ","label":"Azerbaijani"},{"value":"BS","label":"Bahamian"},{"value":"BH","label":"Bahraini"},{"value":"BD","label":"Bangladeshi"},{"value":"BB","label":"Barbadian"},{"value":"BY","label":"Belarusian"},{"value":"BE","label":"Belgian"},{"value":"BZ","label":"Belizean"},{"value":"BJ","label":"Beninese"},{"value":"BM","label":"Bermudian"},{"value":"BT","label":"Bhutanese"},{"value":"BO","label":"Bolivian"},{"value":"BQ","label":"Bonaire"},{"value":"BA","label":"Bosnian or Herzegovinian"},{"value":"BW","label":"Botswanan"},{"value":"BV","label":"Bouvet Island"},{"value":"BR","label":"Brazilian"},{"value":"BN","label":"Bruneian"},{"value":"BG","label":"Bulgarian"},{"value":"BF","label":"Burkinabé"},{"value":"BI","label":"Burundian"},{"value":"CV","label":"Cabo Verdean"},{"value":"KH","label":"Cambodian"},{"value":"CM","label":"Cameroonian"},{"value":"CA","label":"Canadian"},{"value":"KY","label":"Caymanian"},{"value":"CF","label":"Central African"},{"value":"TD","label":"Chadian"},{"value":"CL","label":"Chilean"},{"value":"CN","label":"Chinese"},{"value":"CX","label":"Christmas Island"},{"value":"CC","label":"Cocos Island"},{"value":"CO","label":"Colombian"},{"value":"KM","label":"Comorian"},{"value":"CG","label":"Congolese"},{"value":"CD","label":"Congolese"},{"value":"CK","label":"Cook Island"},{"value":"CR","label":"Costa Rican"},{"value":"CI","label":"Ivorian"},{"value":"HR","label":"Croatian"},{"value":"CU","label":"Cuban"},{"value":"CW","label":"Curaçaoan"},{"value":"CY","label":"Cypriot"},{"value":"CZ","label":"Czech"},{"value":"DK","label":"Danish"},{"value":"DJ","label":"Djiboutian"},{"value":"DM","label":"Dominican"},{"value":"DO","label":"Dominican"},{"value":"EC","label":"Ecuadorian"},{"value":"EG","label":"Egyptian"},{"value":"SV","label":"Salvadoran"},{"value":"GQ","label":"Equatorial Guinean"},{"value":"ER","label":"Eritrean"},{"value":"EE","label":"Estonian"},{"value":"ET","label":"Ethiopian"},{"value":"FK","label":"Falkland Island"},{"value":"FO","label":"Faroese"},{"value":"FJ","label":"Fijian"},{"value":"FI","label":"Finnish"},{"value":"FR","label":"French"},{"value":"GF","label":"French Guianese"},{"value":"PF","label":"French Polynesian"},{"value":"TF","label":"French Southern Territories"},{"value":"GA","label":"Gabonese"},{"value":"GM","label":"Gambian"},{"value":"GE","label":"Georgian"},{"value":"DE","label":"German"},{"value":"GH","label":"Ghanaian"},{"value":"GI","label":"Gibraltar"},{"value":"GR","label":"Greek"},{"value":"GL","label":"Greenlandic"},{"value":"GD","label":"Grenadian"},{"value":"GP","label":"Guadeloupe"},{"value":"GU","label":"Guamanian"},{"value":"GT","label":"Guatemalan"},{"value":"GG","label":"Channel Island"},{"value":"GN","label":"Guinean"},{"value":"GW","label":"Bissau-Guinean"},{"value":"GY","label":"Guyanese"},{"value":"HT","label":"Haitian"},{"value":"HM","label":"Heard Island or McDonald Islands"},{"value":"VA","label":"Vatican"},{"value":"HN","label":"Honduran"},{"value":"HK","label":"Hong Kong"},{"value":"HU","label":"Hungarian"},{"value":"IS","label":"Icelandic"},{"value":"IN","label":"Indian"},{"value":"ID","label":"Indonesian"},{"value":"IR","label":"Iranian"},{"value":"IQ","label":"Iraqi"},{"value":"IE","label":"Irish"},{"value":"IM","label":"Manx"},{"value":"IL","label":"Israeli"},{"value":"IT","label":"Italian"},{"value":"JM","label":"Jamaican"},{"value":"JP","label":"Japanese"},{"value":"JE","label":"Channel Island"},{"value":"JO","label":"Jordanian"},{"value":"KZ","label":"Kazakhstani"},{"value":"KE","label":"Kenyan"},{"value":"KI","label":"I-Kiribati"},{"value":"KP","label":"North Korean"},{"value":"KR","label":"South Korean"},{"value":"KW","label":"Kuwaiti"},{"value":"KG","label":"Kyrgyzstani"},{"value":"LA","label":"Lao"},{"value":"LV","label":"Latvian"},{"value":"LB","label":"Lebanese"},{"value":"LS","label":"Basotho"},{"value":"LR","label":"Liberian"},{"value":"LY","label":"Libyan"},{"value":"LI","label":"Liechtenstein"},{"value":"LT","label":"Lithuanian"},{"value":"LU","label":"Luxembourgish"},{"value":"MO","label":"Macanese"},{"value":"MK","label":"Macedonian"},{"value":"MG","label":"Malagasy"},{"value":"MW","label":"Malawian"},{"value":"MY","label":"Malaysian"},{"value":"MV","label":"Maldivian"},{"value":"ML","label":"Malian"},{"value":"MT","label":"Maltese"},{"value":"MH","label":"Marshallese"},{"value":"MQ","label":"Martiniquais"},{"value":"MR","label":"Mauritanian"},{"value":"MU","label":"Mauritian"},{"value":"YT","label":"Mahoran"},{"value":"MX","label":"Mexican"},{"value":"FM","label":"Micronesian"},{"value":"MD","label":"Moldovan"},{"value":"MC","label":"Monacan"},{"value":"MN","label":"Mongolian"},{"value":"ME","label":"Montenegrin"},{"value":"MS","label":"Montserratian"},{"value":"MA","label":"Moroccan"},{"value":"MZ","label":"Mozambican"},{"value":"MM","label":"Burmese"},{"value":"NA","label":"Namibian"},{"value":"NR","label":"Nauruan"},{"value":"NP","label":"Nepali"},{"value":"NL","label":"Dutch"},{"value":"NC","label":"New Caledonian"},{"value":"NZ","label":"New Zealand"},{"value":"NI","label":"Nicaraguan"},{"value":"NE","label":"Nigerien"},{"value":"NG","label":"Nigerian"},{"value":"NU","label":"Niuean"},{"value":"NF","label":"Norfolk Island"},{"value":"MP","label":"Northern Marianan"},{"value":"NO","label":"Norwegian"},{"value":"OM","label":"Omani"},{"value":"PK","label":"Pakistani"},{"value":"PW","label":"Palauan"},{"value":"PS","label":"Palestinian"},{"value":"PA","label":"Panamanian"},{"value":"PG","label":"Papua New Guinean"},{"value":"PY","label":"Paraguayan"},{"value":"PE","label":"Peruvian"},{"value":"PH","label":"Filipino"},{"value":"PN","label":"Pitcairn Island"},{"value":"PL","label":"Polish"},{"value":"PT","label":"Portuguese"},{"value":"PR","label":"Puerto Rican"},{"value":"QA","label":"Qatari"},{"value":"RE","label":"Réunionese"},{"value":"RO","label":"Romanian"},{"value":"RU","label":"Russian"},{"value":"RW","label":"Rwandan"},{"value":"BL","label":"Barthélemois"},{"value":"SH","label":"Saint Helenian"},{"value":"KN","label":"Kittitian or Nevisian"},{"value":"LC","label":"Saint Lucian"},{"value":"MF","label":"Saint-Martinoise"},{"value":"PM","label":"Saint-Pierrais or Miquelonnais"},{"value":"VC","label":"Saint Vincentian"},{"value":"WS","label":"Samoan"},{"value":"SM","label":"Sammarinese"},{"value":"ST","label":"São Toméan"},{"value":"SA","label":"Saudi"},{"value":"SN","label":"Senegalese"},{"value":"RS","label":"Serbian"},{"value":"SC","label":"Seychellois"},{"value":"SL","label":"Sierra Leonean"},{"value":"SG","label":"Singaporean"},{"value":"SX","label":"Sint Maarten"},{"value":"SK","label":"Slovak"},{"value":"SI","label":"Slovenian"},{"value":"SB","label":"Solomon Island"},{"value":"SO","label":"Somali"},{"value":"ZA","label":"South African"},{"value":"GS","label":"South Georgia or South Sandwich Islands"},{"value":"SS","label":"South Sudanese"},{"value":"ES","label":"Spanish"},{"value":"LK","label":"Sri Lankan"},{"value":"SD","label":"Sudanese"},{"value":"SR","label":"Surinamese"},{"value":"SJ","label":"Svalbard"},{"value":"SZ","label":"Swazi"},{"value":"SE","label":"Swedish"},{"value":"CH","label":"Swiss"},{"value":"SY","label":"Syrian"},{"value":"TW","label":"Taiwanese"},{"value":"TJ","label":"Tajikistani"},{"value":"TZ","label":"Tanzanian"},{"value":"TH","label":"Thai"},{"value":"TL","label":"Timorese"},{"value":"TG","label":"Togolese"},{"value":"TK","label":"Tokelauan"},{"value":"TO","label":"Tongan"},{"value":"TT","label":"Trinidadian or Tobagonian"},{"value":"TN","label":"Tunisian"},{"value":"TR","label":"Turkish"},{"value":"TM","label":"Turkmen"},{"value":"TC","label":"Turks and Caicos Island"},{"value":"TV","label":"Tuvaluan"},{"value":"UG","label":"Ugandan"},{"value":"UA","label":"Ukrainian"},{"value":"AE","label":"Emirati"},{"value":"GB","label":"British"},{"value":"US","label":"American"},{"value":"UY","label":"Uruguayan"},{"value":"UZ","label":"Uzbekistani"},{"value":"VU","label":"Ni-Vanuatu"},{"value":"VE","label":"Venezuelan"},{"value":"VN","label":"Vietnamese"},{"value":"VG","label":"British Virgin Island"},{"value":"VI","label":"U.S. Virgin Island"},{"value":"WF","label":"Wallis and Futuna"},{"value":"EH","label":"Sahrawi"},{"value":"YE","label":"Yemeni"},{"value":"ZM","label":"Zambian"},{"value":"ZW","label":"Zimbabwean"}];


    constructor(private router: Router, private formDataService: FormDataService, private eRef: ElementRef, private callsService: CallsService, private alertService: AlertService, private dataService: DataService, private deviceService: DeviceDetectorService) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate()-42705);
        this.maxDate.setDate(this.maxDate.getDate()-6570);
    }


    ngOnInit() {
        this.personal = this.formDataService.getPersonal();
        var video = document.getElementById('videoElement') as HTMLVideoElement;
        this.isMobile = this.deviceService.isMobile();
        console.log("Is mobile");
        console.log(this.isMobile);
    }

    ngAfterViewInit() {
    }

    processType(documentType: any){
        if(documentType == 'passport'){
            this.passportPhoto();
        }
        if(documentType == 'id'){
            this.idPhoto();
        }
        // if(documentType == 'drivers'){
        //     this.driversPhoto();
        // }
    }

        //     navigator.mediaDevices.getUserMedia({ video: {
        //         facingMode: {exact: "environment"}
        //     } }).then(stream => {
        //         this.passportVideo.nativeElement.srcObject = stream;
        //         this.passportVideo.nativeElement.play();
        //         this.passportStream = stream;
        //     }).catch(err => {
        //         if(err.name == 'OverconstrainedError'){
        //             window.alert("Your device's camera resolution is not high enough to proceed.");
        //         }
        //     });
    config: any = {};
    passportPhoto(){
        //this.config = {video: {}}
        if(this.isMobile == true){
            window.alert("Mobile device");
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                navigator.mediaDevices.getUserMedia({ video: {
                    facingMode: { exact: "environment"}
                } }).then(stream => {
                    this.idVideo.nativeElement.srcObject = stream;
                    this.idVideo.nativeElement.play();
                    this.idStream = stream;
                }).catch(err => {
                    if(err.name == 'OverconstrainedError'){
                        window.alert("Your device's camera resolution is not high enough to proceed.");
                    }
                });
            }
        }
        else {
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                navigator.mediaDevices.getUserMedia({ video: {
                    width: {min: 1080},height: {min: 720}
                } }).then(stream => {
                    this.passportVideo.nativeElement.srcObject = stream;
                    this.passportVideo.nativeElement.play();
                    this.passportStream = stream;
                }).catch(err => {
                    if(err.name == 'OverconstrainedError'){
                        window.alert("Your device's camera resolution is not high enough to proceed.");
                    }
                });
            }
        }
    }
    
    idPhoto(){
        if(this.isMobile == true){
            window.alert("Mobile device");
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                navigator.mediaDevices.getUserMedia({ video: {
                    facingMode: { exact: "environment"}
                } }).then(stream => {
                    this.idVideo.nativeElement.srcObject = stream;
                    this.idVideo.nativeElement.play();
                    this.idStream = stream;
                }).catch(err => {
                    if(err.name == 'OverconstrainedError'){
                        window.alert("Your device's camera resolution is not high enough to proceed.");
                    }
                });
            }
        }
        else {
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                navigator.mediaDevices.getUserMedia({ video: {
                    width: {min: 1080},height: {min: 720}
                } }).then(stream => {
                    this.idVideo.nativeElement.srcObject = stream;
                    this.idVideo.nativeElement.play();
                    this.idStream = stream;
                }).catch(err => {
                    if(err.name == 'OverconstrainedError'){
                        window.alert("Your device's camera resolution is not high enough to proceed.");
                    }
                });
            }
        }
    }
    

    dataURItoBlob(dataURI){
        const byteString = atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });    
        return blob;
    }

    capture(documentType: any){
        //console.log("Captured from: " + documentType);
        //this.showCanvas = true;
        this.identityDocument = '';
        if(documentType == 'passport'){
            this.passportCaptured = true;
            var context = this.passportCanvas.nativeElement.getContext("2d").drawImage(this.passportVideo.nativeElement, 13, 0, 980, 540);
            this.identityDocument = this.passportCanvas.nativeElement.toDataURL("image/png");
            this.passportCapture = this.identityDocument;
            this.passportCanvas.nativeElement.style.display = 'none';
            var base64 = this.identityDocument.split(",");
            //console.log(base64[0] + "," + base64[1]);
            var imageBlob = this.dataURItoBlob(base64[1]);
            //saveAs(imageBlob,"passportFront.png");
            this.passportFront = new File([imageBlob], 'passportFront.png', { type: 'image/png' });
            this.documentOk = true;
        }
        if(documentType == 'id'){
            if(this.captures.length >= 2){
                this.captures = [];
            }

            var re = /id_back.png/;

            // Changing the overlay according to if it is the front or back side
            
            var overlay = document.getElementById('overlay-image') as HTMLImageElement;
            if(re.test(overlay.src) == true) {
                overlay.src = '../../../../assets/images/id.png';
            }
            else {
                overlay.src = '../../../../assets/images/id_back.png';
            }

            var context = this.idCanvas.nativeElement.getContext("2d").drawImage(this.idVideo.nativeElement, 13, 0, 980, 540);
            this.identityDocument = this.idCanvas.nativeElement.toDataURL("image/png");
            this.idCanvas.nativeElement.style.display = 'none';
            this.captures.push(this.identityDocument);
            if(this.captures[0] != undefined){
                var base64front = this.captures[0].split(",");
                var imageBlobFront = this.dataURItoBlob(base64front[1]);
                //console.log(base64front[0] + "," + base64front[1]); 
                //saveAs(imageBlobFront,"passportFront.png");
                this.passportFront = new File([imageBlobFront],'passportFront.png',{type: 'image/png'});
            }
            if(this.captures[1] != undefined){
                var base64back = this.captures[1].split(",");
                var imageBlobBack = this.dataURItoBlob(base64back[1]);
                //console.log(base64back[0] + "," + base64back[1]); 
                //saveAs(imageBlobBack,"passportBack.png");
                this.passportBack = new File([imageBlobBack],'passportBack.png',{type: 'image/png'});
            }
            this.documentOk = true;
        }
        // if(documentType == 'drivers'){
        //     var context = this.driversCanvas.nativeElement.getContext("2d").drawImage(this.driversVideo.nativeElement, 13, 0, 393, 295);
        //     this.identityDocument = this.driversCanvas.nativeElement.toDataURL("image/png");
        //     console.log(this.identityDocument);
        //     this.documentOk = true;
        //     this.loading = true;
        // }
        //$('#video').remove();
        //$('.overlay-id').remove();
    }

    // driversPhoto(){
    //     if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    //         navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    //             this.driversVideo.nativeElement.srcObject = stream;
    //             this.driversVideo.nativeElement.play();
    //         });
    //     }
    // }


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
        return true;
    }

    /** 
    * Function used for navigation
    */
    goToPrevious(form: any) {
        this.formDataService.setRegisterState('1');
    //this.formDataService.setPreviousOtherClicked(true);
    }

    /** 
    * Function used for navigation
    */
    goToNext(form: any) {
        this.loading = true;
        this.documentOk = false;
        if(this.documentType == 'id'){
            // console.log(this.passportFront);
            // console.log(this.passportBack);
            this.callsService.addIdCard(this.formDataService.getPersonal().email, this.passportFront, this.passportBack).subscribe(
                data => {
                    if(data){
                        this.response = data;
                        console.log("Extracted from MRZ:");
                        console.log("First Name: " + this.response.GivenName);
                        console.log("Last Name: " + this.response.Surname);
                        console.log("Date of birth: " + this.response.DateOfBirth);
                        console.log("Sex: " + this.response.Sex);
                        console.log("Issuing country: " + this.response.IssuingCountry);
                        console.log("Document type: " + this.response.PassportType);
                        console.log("Document number: " + this.response.PassportNumber); 
                        console.log("Date of expiration: " + this.response.DateOfExpiration);
                        this.loading = false;
                        this.dataService.setMrzData(null);
                        this.dataService.setMrzData(this.response);
                        if(this.idStream){this.idStream.getTracks()[0].stop();}      
                        if(this.passportStream){this.passportStream.getTracks()[0].stop();}    
                        this.callsService.faceMatch(this.formDataService.getPersonal().email).subscribe(
                            data => console.log(data),
                            error => console.log(error)
                        );  
                        this.formDataService.setRegisterState('3'); 
                    }          
                },
                error => {
                    console.log("ERROR");
                    console.log(error);
                    this.loading = false;
                    this.documentOk = true;
                    this.alertService.error("Document could not be extracted, please try again.");
                }

            );
        }
        else {
            // console.log(this.passportFront);
            // console.log(this.passportBack);
            this.callsService.addPassport(this.formDataService.getPersonal().email, this.passportFront, null).subscribe(
                data => {
                    if(data){
                        console.log("DATA");
                        console.log(data);  
                        this.loading = false;
                        this.dataService.setMrzData(null);
                        this.dataService.setMrzData(data);
                        if(this.idStream){this.idStream.getTracks()[0].stop();}      
                        if(this.passportStream){this.passportStream.getTracks()[0].stop();}  
                        this.callsService.faceMatch(this.formDataService.getPersonal().email).subscribe(
                            data => console.log(data),
                            error => console.log(error)
                        );  
                        this.formDataService.setRegisterState('3'); 
                    }   
                },
                error => {
                    console.log("ERROR");
                    console.log(error);
                    this.loading = false;
                    this.documentOk = true;
                    this.alertService.error("Document could not be extracted, please try again.");
                    
                }
            );
        }
        //if (this.save(form)) {
        //console.log(this.documentType);
        //this.formDataService.setRegisterState('3');
        //this.passportVideo.nativeElement.stop();
    // }
    }

}
