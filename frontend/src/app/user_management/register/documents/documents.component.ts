import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormDataService } from '../data/formData.service';
import { Documents } from '../data/formData.model';
import * as $ from 'jquery';

declare var MediaRecorder: any;
/** 
 * Implements the documents step of the registering form
*/
@Component ({
    selector:     'documents'
    ,templateUrl: './documents.component.html'
})

export class DocumentsComponent implements OnInit {
    title = 'Upload Documents';
    documents: Documents;
    form: any;
    passportFrontFilled: any = false;
    passportBackFilled: any = false;
    selfieFilled: any = false;
    proofOfResidenceFilled: any = false;
    passport: any;
    
    @ViewChild("video")
    public video: ElementRef;
    @ViewChild("canvas")
    public canvas: ElementRef;

    //public captures: Array<any>;

    constructor(private router: Router, private formDataService: FormDataService) {
        this.passport = '';
    }

    ngOnInit() {
        this.documents = this.formDataService.getDocuments();
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
        this.formDataService.setDocuments(this.documents);
        return true;
    }

    /** 
    * Function used for processing the identity document front
    * @param {FileList} files - input file
    */
    processPassportFront(files: FileList) {
        console.log(files.item(0));
        this.passportFrontFilled = true;
        this.documents.passportFront = files.item(0);
        var preview = (document.getElementById('passportFrontPreview') as HTMLImageElement);
        var reader = new FileReader();
        reader.addEventListener("load",function(){
        preview.src = reader.result;
        },false);
        reader.readAsDataURL(files.item(0));
    }

    /** 
    * Function used for processing the identity document back
    * @param {FileList} files - input file
    */
    processPassportBack(files: FileList) {
        console.log(files.item(0));
        this.passportBackFilled = true;
        this.documents.passportBack = files.item(0);
        var preview = (document.getElementById('passportBackPreview') as HTMLImageElement);
        var reader = new FileReader();
        reader.addEventListener("load",function(){
        preview.src = reader.result;
        },false);
        reader.readAsDataURL(files.item(0));
    }

    /** 
    * Function used for processing the selfie
    * @param {FileList} files - input file
    */
    processSelfie(files: FileList) {
        console.log(files.item(0));
        this.selfieFilled = true;
        this.documents.selfie = files.item(0);
        var preview = (document.getElementById('selfiePreview') as HTMLImageElement);
        var reader = new FileReader();
        reader.addEventListener("load",function(){
        preview.src = reader.result;
        },false);
        reader.readAsDataURL(files.item(0));
    }

    /** 
    * Function used for processing the proof of residence
    * @param {FileList} files - input file
    // */
    // processProofOfResidence(files: FileList) {
    //     console.log(files.item(0));
    //     this.proofOfResidenceFilled = true;
    //     //this.documents.proofOfResidence = files.item(0);
    //     var preview = (document.getElementById('proofOfResidencePreview') as HTMLImageElement);
    //     var reader = new FileReader();
    //     reader.addEventListener("load",function(){
    //     preview.src = reader.result;
    //     },false);
    //     reader.readAsDataURL(files.item(0));
    // }

    /** 
    * Function used for navigation
    */
    goToPrevious(form: any) {
        this.formDataService.setRegisterState('2');
        this.formDataService.setPreviousDocumentsClicked(true);
    }

    /** 
    * Function used for navigation
    */
    goToNext(form: any) {
        if (this.save(form)) {
            this.formDataService.setRegisterState('4');
        }
    }

}