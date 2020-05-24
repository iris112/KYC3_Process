import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertService, CallsService } from '../../_services';
import {config} from '../../../assets/configuration';
import { FormDataService } from './data/formData.service';
import { DeviceDetectorService } from 'ngx-device-detector';

/** 
 * Implements the registration page
*/
@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  error: string;
  companyName: string = config.companyName;
  registerState: string = '';
  deviceInfo = null;

  constructor ( private formDataService: FormDataService, private deviceService: DeviceDetectorService ) {}

  ngOnInit() {
    this.formDataService.resetFormData();
    this.formDataService.setRegisterState('0');
    this.formDataService.currentRegisterState.subscribe(message => this.registerState = message);
    //console.log(this.registerState);
    this.deviceInfo = this.deviceService.getDeviceInfo();
    if(this.deviceInfo.browser != "Chrome"){
      window.alert("We recommend using the Google Chrome browser to get the best experience from the KYC box.");
    }
  }

}

