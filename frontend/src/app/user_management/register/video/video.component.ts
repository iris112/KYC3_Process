import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Personal } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import * as $ from 'jquery';
import { config } from '../../../../assets/configuration';
import { CallsService, AlertService } from '../../../_services';
import { saveAs } from 'file-saver/FileSaver';

declare var MediaRecorder: any;

/** 
 * Implements the personal step of the registering form
*/
@Component ({
    selector:     'videoOnboarding'
    ,templateUrl: './video.component.html'
})

export class VideoComponent implements OnInit {
    title = 'Video Recording';
    personal: Personal;
    form: any;
    nationalityFilled: any = false;
    nationality: any = '';
    minDate: Date;
    maxDate: Date;
    chunks: any = [];
    loadingImg: any = config.loadingImg;
    words: any = [];
    videoSelfie: File;
    loading: any = false;
    selfieResponse: any = {};
    email: any = '';
    
    nationalities = [{"value":"AF","label":"Afghan"},{"value":"AL","label":"Albanian"},{"value":"DZ","label":"Algerian"},{"value":"AS","label":"American Samoan"},{"value":"AD","label":"Andorran"},{"value":"AO","label":"Angolan"},{"value":"AI","label":"Anguillan"},{"value":"AQ","label":"Antarctic"},{"value":"AG","label":"Antiguan or Barbudan"},{"value":"AR","label":"Argentine"},{"value":"AM","label":"Armenian"},{"value":"AW","label":"Aruban"},{"value":"AU","label":"Australian"},{"value":"AT","label":"Austrian"},{"value":"AZ","label":"Azerbaijani"},{"value":"BS","label":"Bahamian"},{"value":"BH","label":"Bahraini"},{"value":"BD","label":"Bangladeshi"},{"value":"BB","label":"Barbadian"},{"value":"BY","label":"Belarusian"},{"value":"BE","label":"Belgian"},{"value":"BZ","label":"Belizean"},{"value":"BJ","label":"Beninese"},{"value":"BM","label":"Bermudian"},{"value":"BT","label":"Bhutanese"},{"value":"BO","label":"Bolivian"},{"value":"BQ","label":"Bonaire"},{"value":"BA","label":"Bosnian or Herzegovinian"},{"value":"BW","label":"Botswanan"},{"value":"BV","label":"Bouvet Island"},{"value":"BR","label":"Brazilian"},{"value":"BN","label":"Bruneian"},{"value":"BG","label":"Bulgarian"},{"value":"BF","label":"Burkinabé"},{"value":"BI","label":"Burundian"},{"value":"CV","label":"Cabo Verdean"},{"value":"KH","label":"Cambodian"},{"value":"CM","label":"Cameroonian"},{"value":"CA","label":"Canadian"},{"value":"KY","label":"Caymanian"},{"value":"CF","label":"Central African"},{"value":"TD","label":"Chadian"},{"value":"CL","label":"Chilean"},{"value":"CN","label":"Chinese"},{"value":"CX","label":"Christmas Island"},{"value":"CC","label":"Cocos Island"},{"value":"CO","label":"Colombian"},{"value":"KM","label":"Comorian"},{"value":"CG","label":"Congolese"},{"value":"CD","label":"Congolese"},{"value":"CK","label":"Cook Island"},{"value":"CR","label":"Costa Rican"},{"value":"CI","label":"Ivorian"},{"value":"HR","label":"Croatian"},{"value":"CU","label":"Cuban"},{"value":"CW","label":"Curaçaoan"},{"value":"CY","label":"Cypriot"},{"value":"CZ","label":"Czech"},{"value":"DK","label":"Danish"},{"value":"DJ","label":"Djiboutian"},{"value":"DM","label":"Dominican"},{"value":"DO","label":"Dominican"},{"value":"EC","label":"Ecuadorian"},{"value":"EG","label":"Egyptian"},{"value":"SV","label":"Salvadoran"},{"value":"GQ","label":"Equatorial Guinean"},{"value":"ER","label":"Eritrean"},{"value":"EE","label":"Estonian"},{"value":"ET","label":"Ethiopian"},{"value":"FK","label":"Falkland Island"},{"value":"FO","label":"Faroese"},{"value":"FJ","label":"Fijian"},{"value":"FI","label":"Finnish"},{"value":"FR","label":"French"},{"value":"GF","label":"French Guianese"},{"value":"PF","label":"French Polynesian"},{"value":"TF","label":"French Southern Territories"},{"value":"GA","label":"Gabonese"},{"value":"GM","label":"Gambian"},{"value":"GE","label":"Georgian"},{"value":"DE","label":"German"},{"value":"GH","label":"Ghanaian"},{"value":"GI","label":"Gibraltar"},{"value":"GR","label":"Greek"},{"value":"GL","label":"Greenlandic"},{"value":"GD","label":"Grenadian"},{"value":"GP","label":"Guadeloupe"},{"value":"GU","label":"Guamanian"},{"value":"GT","label":"Guatemalan"},{"value":"GG","label":"Channel Island"},{"value":"GN","label":"Guinean"},{"value":"GW","label":"Bissau-Guinean"},{"value":"GY","label":"Guyanese"},{"value":"HT","label":"Haitian"},{"value":"HM","label":"Heard Island or McDonald Islands"},{"value":"VA","label":"Vatican"},{"value":"HN","label":"Honduran"},{"value":"HK","label":"Hong Kong"},{"value":"HU","label":"Hungarian"},{"value":"IS","label":"Icelandic"},{"value":"IN","label":"Indian"},{"value":"ID","label":"Indonesian"},{"value":"IR","label":"Iranian"},{"value":"IQ","label":"Iraqi"},{"value":"IE","label":"Irish"},{"value":"IM","label":"Manx"},{"value":"IL","label":"Israeli"},{"value":"IT","label":"Italian"},{"value":"JM","label":"Jamaican"},{"value":"JP","label":"Japanese"},{"value":"JE","label":"Channel Island"},{"value":"JO","label":"Jordanian"},{"value":"KZ","label":"Kazakhstani"},{"value":"KE","label":"Kenyan"},{"value":"KI","label":"I-Kiribati"},{"value":"KP","label":"North Korean"},{"value":"KR","label":"South Korean"},{"value":"KW","label":"Kuwaiti"},{"value":"KG","label":"Kyrgyzstani"},{"value":"LA","label":"Lao"},{"value":"LV","label":"Latvian"},{"value":"LB","label":"Lebanese"},{"value":"LS","label":"Basotho"},{"value":"LR","label":"Liberian"},{"value":"LY","label":"Libyan"},{"value":"LI","label":"Liechtenstein"},{"value":"LT","label":"Lithuanian"},{"value":"LU","label":"Luxembourgish"},{"value":"MO","label":"Macanese"},{"value":"MK","label":"Macedonian"},{"value":"MG","label":"Malagasy"},{"value":"MW","label":"Malawian"},{"value":"MY","label":"Malaysian"},{"value":"MV","label":"Maldivian"},{"value":"ML","label":"Malian"},{"value":"MT","label":"Maltese"},{"value":"MH","label":"Marshallese"},{"value":"MQ","label":"Martiniquais"},{"value":"MR","label":"Mauritanian"},{"value":"MU","label":"Mauritian"},{"value":"YT","label":"Mahoran"},{"value":"MX","label":"Mexican"},{"value":"FM","label":"Micronesian"},{"value":"MD","label":"Moldovan"},{"value":"MC","label":"Monacan"},{"value":"MN","label":"Mongolian"},{"value":"ME","label":"Montenegrin"},{"value":"MS","label":"Montserratian"},{"value":"MA","label":"Moroccan"},{"value":"MZ","label":"Mozambican"},{"value":"MM","label":"Burmese"},{"value":"NA","label":"Namibian"},{"value":"NR","label":"Nauruan"},{"value":"NP","label":"Nepali"},{"value":"NL","label":"Dutch"},{"value":"NC","label":"New Caledonian"},{"value":"NZ","label":"New Zealand"},{"value":"NI","label":"Nicaraguan"},{"value":"NE","label":"Nigerien"},{"value":"NG","label":"Nigerian"},{"value":"NU","label":"Niuean"},{"value":"NF","label":"Norfolk Island"},{"value":"MP","label":"Northern Marianan"},{"value":"NO","label":"Norwegian"},{"value":"OM","label":"Omani"},{"value":"PK","label":"Pakistani"},{"value":"PW","label":"Palauan"},{"value":"PS","label":"Palestinian"},{"value":"PA","label":"Panamanian"},{"value":"PG","label":"Papua New Guinean"},{"value":"PY","label":"Paraguayan"},{"value":"PE","label":"Peruvian"},{"value":"PH","label":"Filipino"},{"value":"PN","label":"Pitcairn Island"},{"value":"PL","label":"Polish"},{"value":"PT","label":"Portuguese"},{"value":"PR","label":"Puerto Rican"},{"value":"QA","label":"Qatari"},{"value":"RE","label":"Réunionese"},{"value":"RO","label":"Romanian"},{"value":"RU","label":"Russian"},{"value":"RW","label":"Rwandan"},{"value":"BL","label":"Barthélemois"},{"value":"SH","label":"Saint Helenian"},{"value":"KN","label":"Kittitian or Nevisian"},{"value":"LC","label":"Saint Lucian"},{"value":"MF","label":"Saint-Martinoise"},{"value":"PM","label":"Saint-Pierrais or Miquelonnais"},{"value":"VC","label":"Saint Vincentian"},{"value":"WS","label":"Samoan"},{"value":"SM","label":"Sammarinese"},{"value":"ST","label":"São Toméan"},{"value":"SA","label":"Saudi"},{"value":"SN","label":"Senegalese"},{"value":"RS","label":"Serbian"},{"value":"SC","label":"Seychellois"},{"value":"SL","label":"Sierra Leonean"},{"value":"SG","label":"Singaporean"},{"value":"SX","label":"Sint Maarten"},{"value":"SK","label":"Slovak"},{"value":"SI","label":"Slovenian"},{"value":"SB","label":"Solomon Island"},{"value":"SO","label":"Somali"},{"value":"ZA","label":"South African"},{"value":"GS","label":"South Georgia or South Sandwich Islands"},{"value":"SS","label":"South Sudanese"},{"value":"ES","label":"Spanish"},{"value":"LK","label":"Sri Lankan"},{"value":"SD","label":"Sudanese"},{"value":"SR","label":"Surinamese"},{"value":"SJ","label":"Svalbard"},{"value":"SZ","label":"Swazi"},{"value":"SE","label":"Swedish"},{"value":"CH","label":"Swiss"},{"value":"SY","label":"Syrian"},{"value":"TW","label":"Taiwanese"},{"value":"TJ","label":"Tajikistani"},{"value":"TZ","label":"Tanzanian"},{"value":"TH","label":"Thai"},{"value":"TL","label":"Timorese"},{"value":"TG","label":"Togolese"},{"value":"TK","label":"Tokelauan"},{"value":"TO","label":"Tongan"},{"value":"TT","label":"Trinidadian or Tobagonian"},{"value":"TN","label":"Tunisian"},{"value":"TR","label":"Turkish"},{"value":"TM","label":"Turkmen"},{"value":"TC","label":"Turks and Caicos Island"},{"value":"TV","label":"Tuvaluan"},{"value":"UG","label":"Ugandan"},{"value":"UA","label":"Ukrainian"},{"value":"AE","label":"Emirati"},{"value":"GB","label":"British"},{"value":"US","label":"American"},{"value":"UY","label":"Uruguayan"},{"value":"UZ","label":"Uzbekistani"},{"value":"VU","label":"Ni-Vanuatu"},{"value":"VE","label":"Venezuelan"},{"value":"VN","label":"Vietnamese"},{"value":"VG","label":"British Virgin Island"},{"value":"VI","label":"U.S. Virgin Island"},{"value":"WF","label":"Wallis and Futuna"},{"value":"EH","label":"Sahrawi"},{"value":"YE","label":"Yemeni"},{"value":"ZM","label":"Zambian"},{"value":"ZW","label":"Zimbabwean"}];


    constructor(private router: Router, private formDataService: FormDataService, private callsService: CallsService, private alertService: AlertService) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate()-42705);
        this.maxDate.setDate(this.maxDate.getDate()-6570);
    }


    ngOnInit() {
        this.personal = this.formDataService.getPersonal();
        this.callsService.getWordList(this.formDataService.getPersonal().email,'5').subscribe(
            data => {
                this.words = data;
                var words = document.getElementsByClassName('words') as HTMLCollectionOf<Element>;
                words[0].innerHTML = this.words;
            },
            error => console.log(error)
        );
        var video = document.getElementById('videoElement') as HTMLVideoElement;
        var startButton = document.getElementById('startButton') as HTMLButtonElement;
        startButton.disabled = false;
    }

    startRecording(){
        //console.log("recording started");
        var video = document.getElementById('videoElement') as HTMLVideoElement;
        var startButton = document.getElementById('startButton') as HTMLButtonElement;
        startButton.disabled = true;
        //new Audio('../../../../assets/instructions.mp3').play(); 
            if (navigator.mediaDevices.getUserMedia) {   
                // new Audio('../../../../assets/instructions.mp3').play(); 
                navigator.mediaDevices.getUserMedia({video: true,audio: true})
              .then(function(stream) {
                  video.srcObject = stream;
                  video.muted = true;
                    $('.overlay-desc').append("<div id='overlay-text' style='z-index: 2;position: absolute;color: white;'></div>");
                    var test = document.getElementById('overlay-text') as HTMLElement;
                    setTimeout(function () {
                        new Audio('../../../../assets/beep.mp3').play();
                        text.setAttribute("style","font-size: 22px;text-align: center;margin-left: -43px;z-index: 2;position: absolute;color: white;");
                        test.innerHTML = "Try to place your face in the red circle.";
                    }, 2500);
                    setTimeout(function () {
                        text.setAttribute("style","font-size: 24px;text-align: center;margin-left: 10px;z-index: 2;position: absolute;color: white;");
                        new Audio('../../../../assets/beep.mp3').play();
                        test.innerHTML = "A countdown will start.";
                    }, 4500);
                    setTimeout(function () {
                        text.setAttribute("style","font-size: 24px;text-align: center;z-index: 2;position: absolute;color: white;");
                        new Audio('../../../../assets/beep.mp3').play();
                        test.innerHTML = "After the countdown,<br>words will appear on the screen.";
                    }, 6500);
                    setTimeout(function () {
                        text.setAttribute("style","font-size: 24px;text-align: center;z-index: 2;margin-left: 5px;position: absolute;color: white;");
                        new Audio('../../../../assets/beep.mp3').play();
                        test.innerHTML = "Read the words out loud.";
                    }, 8500);
                    setTimeout(function() {
                        $('.overlay-desc').append("<div class='oval' style='position: absolute;z-index: 3;'></div>");
                        //new Audio('../../../../assets/beep.mp3').play();
                        test.innerHTML = "";
                    }, 10500);
                    setTimeout(function () {
                        text.setAttribute("style","text-align: center;z-index: 2;position: absolute;color: white;");
                        new Audio('../../../../assets/beep.mp3').play();
                        test.innerHTML = "3";
                    }, 13000);
                    setTimeout(function () {
                        new Audio('../../../../assets/beep.mp3').play();
                        test.innerHTML = "2";
                    }, 14000);
                    setTimeout(function () {
                        new Audio('../../../../assets/beep.mp3').play();
                        test.innerHTML = "1";
                    }, 15000);
                    setTimeout(function () {
                        new Audio('../../../../assets/beep2.wav').play();
                        test.innerHTML = "GO";
                    }, 16000);
                    const mediaRecorder = new MediaRecorder(stream,{mimeType: 'video/webm;codecs=h264'});
                    mediaRecorder.ondataavailable = function(e) {
                        if(this.chunks == undefined){this.chunks = [];}
                        this.chunks.push(e.data);
                    };
                    mediaRecorder.onstop = function(e) {
                        var blob = new Blob(this.chunks, {'type': 'video/webm'});
                        var finalVideo = document.getElementById('final-video') as HTMLVideoElement;
                        finalVideo.src = window.URL.createObjectURL(blob);
                        finalVideo.controls = true;
                        var nextButton = document.getElementById('next-button') as HTMLButtonElement;
                        nextButton.setAttribute('style','display: inline');
                        stream.getTracks()
                        .forEach( track => track.stop() );
                        //$('#video-container').remove();
                    };
                    
                    var text = document.getElementById('overlay-text') as HTMLElement;        
                    var desc = document.getElementsByClassName('overlay-desc') as HTMLCollectionOf<Element>;         
    
                    var tmp = document.getElementsByClassName('words') as HTMLCollectionOf<Element>;
                    var words = tmp[0].innerHTML.split(',');
    
                    console.log("DESC");
                    console.log(desc);
    
                    setTimeout(function () {
                        desc[0].children[2].setAttribute('style','border: none;');
                        text.innerHTML = '';
                        mediaRecorder.start();
                    }, 17000);
                    setTimeout(function () {
                        text.innerHTML = words[0];
                    }, 18000);
                    setTimeout(function () {
                        text.innerHTML = '';
                    }, 19500);
                    setTimeout(function () {
                        text.innerHTML = words[1];
                    }, 20000);
                    setTimeout(function () {
                        text.innerHTML = '';
                    }, 21500);
                    setTimeout(function () {
                        text.innerHTML = words[2];
                    }, 22000);
                    setTimeout(function () {
                        text.innerHTML = '';
                    }, 23500);
                    setTimeout(function () {
                        text.innerHTML = words[3];
                    }, 24000);
                    setTimeout(function () {
                        text.innerHTML = '';
                    }, 25500);
                    setTimeout(function () {
                        text.innerHTML = words[4];
                    }, 26000);
                    setTimeout(function () {
                        text.innerHTML = '';
                    }, 27500);
                    setTimeout(function () {
                        mediaRecorder.stop();
                    },29500);
    
                    setTimeout(function () {
                        $('.overlay-desc').append("<div id='thank-you' style='position: absolute;z-index: 3;color: white;font-size: 24px;'>THANK YOU!<br><br>Please click 'Next'.</div>")
                        // $('#overlay-text').append("<div id='overlay-text' style='position: absolute;font-size: 18pt;color: white;z-index: 3;'>THANK YOU!<br><br>Please click 'Next'</div>");
                        // text.setAttribute('style','font-size: 18pt;color: white;z-index: 3;');
                        // text.innerHTML = 'THANK YOU!<br><br>Please click "Next"';
                    },30500);
              })
              .catch(function(err0r) {
                console.log("Something went wrong!");
                console.log(err0r);
              });
            }
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
        return true;
    }

    /** 
    * Function used for navigation
    */
    goToPrevious(form: any) {
        this.formDataService.setRegisterState('0');
        //this.formDataService.setPreviousOtherClicked(true);
    }

    /** 
    * Function used for navigation
    */
    goToNext(form: any) {
        var count = 0;
        this.loading = true;
        var selfieVideo = document.getElementById('final-video') as HTMLVideoElement;
        var blobUrl = selfieVideo.src;
        this.callsService.getSelfieBlob(blobUrl).subscribe(
            data => {
                this.videoSelfie = new File([data],'selfieVideo', {type: 'video/webm', lastModified: Date.now()});
                // console.log(this.videoSelfie);
                //saveAs(data, 'selfieVideo.webm');
                console.log(this.words.toString());
                //this.formDataService.setRegisterState('2');
                this.callsService.addVideoAuth(this.formDataService.getPersonal().email, this.videoSelfie, this.words.toString()).subscribe(
                    data => {
                        if(data){
                            this.loading = false;
                            // console.log(data);
                            this.formDataService.setRegisterState('2');
                        //     this.selfieResponse = data;
                        //     // Transforming words to lowercase
                        //     for(var j = 0; j < this.words.length; j++){
                        //         this.words[j] = this.words[j].toLowerCase();
                        //     }
                        //     console.log("GENERATED WORDS");
                        //     console.log(this.words);
                        //     console.log("RETURNED WORDS");
                        //     console.log(this.selfieResponse.returnWords);
                        //     if(this.words.length == this.selfieResponse.returnWords.length){
                        //         for(var i = 0; i < this.words.length; i++){
                        //             if(this.words[i] != this.selfieResponse.returnWords[i]){
                        //                 count += 1;
                        //             }
                        //             else {
                        //                 count += 0;
                        //             }
                        //         }
                        //         if(count == 0){
                        //             this.formDataService.setRegisterState('4');
                        //         }
                        //         else {
                        //             this.loading = false;
                        //             this.alertService.error('The words detected did not match the words displayed.');
                        //         }
                        //         this.formDataService.setRegisterState('4');
                        //     }
                        //     else {
                        //         this.alertService.error("The number of words detected does not match the number of words displayed.");
                        //     }
                        // }
                    }
                },
                    error => {
                        this.loading = false;
                        this.alertService.error("Error in sending video to server");
                        console.log(error);
                    }
                );
            },
            error => {
                console.log("ERROR ON GETTING SELFIE BLOB");
                console.log(error);
            }
        );
    }

}
