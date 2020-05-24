import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DeviceDetectorService} from 'ngx-device-detector';

import { AlertService, CallsService } from '../_services/index';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import { Title } from '@angular/platform-browser';
import { config } from '../../assets/configuration';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';

const wa = window as any;

const minABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

var Token = undefined;
const WEI = 1000000000000000000

@Component({
    moduleId: module.id,
    templateUrl: 'tokens.component.html',
    styleUrls: ['./tokens.component.css']
})

export class TokensComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('cardInfo') cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;


  model: any = {};
  userTest: any = {};
  loading = false;
  loadingfree = false;
  isCodeValid: any = true;
  ipResponse: any;
  geoResponse: any;
  eurResponse: any;
  usdResponse: any;
  euroPrices: any = true;
  email: any = '';
  tokensNo: any = 1;
  loadingImg: any = config.loadingGif;
  walletAddress: any = '';
  ethAddress: any = '0xe99356bde974bbe08721d77712168fa070aa8da4';
  btcAddress: any = '1BoatSLRHtKNngkdXEeobR76b53LETtpyT';
  currency: any = '';

  tabs = {};

  //plans: any = Plan;
  plans = [];
  europeCountries = ['AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FO','FI','FR','DE','GI','GR','HU','IS','IE','IM','IT','XK','LV','LI','LT','LU','MK','MT','MD','MC','ME','NL','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB','VA'];
  isTrial = false;
  countryFilled = false;
  token: any = false;
  eth: any = false;
  btc: any = false;
  cc: any = false;
  bsModalRef: BsModalRef;

  passwordConfirm = "";

  constructor(
    private router: Router,
    private callsService: CallsService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private titleService: Title,
    private deviceService: DeviceDetectorService,
    private modalService: BsModalService
    // private RegisterUserModel: User
  ) {
    //this.getPlans();
    this.tabs = { '1': true, '2': true, '3': true };
    this.passwordConfirm = "";

    this.route.queryParams.subscribe(params => {
      this.model.firstname = params['firstname'];
      this.model.lastname = params['lastname'];
      this.model.username   = params['email'];
    });
    //this.browserDetection();
  }

  ngOnInit() {
    this.titleService.setTitle('KYC3 | Buy Tokens');
    var div = document.getElementById("creditPayment") as HTMLDivElement;
    console.log(div);
    div.hidden = true;
    this.callsService.getCurrentEURPrices().subscribe(
      data => {
        console.log(data);
        this.eurResponse = data;
      },
      error => console.log(error)
    );
    this.callsService.getCurrentUSDPrices().subscribe(
      data => {
        console.log(data);
        this.usdResponse = data;
      },
      error => console.log(error)
    );
    // this.callsService.getIP().subscribe(
    //   data => {
    //     console.log(data);
    //     if(data){
    //       this.ipResponse = data;
    //       this.callsService.getGeolocation(this.ipResponse.ip).subscribe(
    //         data => {
    //           this.geoResponse = data;
    //           if(this.europeCountries.indexOf(this.geoResponse.country) != -1){
    //             this.euroPrices = true;
    //             this.getPlans();
    //           }
    //           else {
    //             this.euroPrices = false;
    //             this.getPlans();
    //           }
    //         },
    //         error => console.log(error)
    //       );
    //     }
    //   },
    //   error => console.log(error)
    // );
    // this.callsService.getDiscountCodes().subscribe(
    //   data => console.log(data),
    //   error => console.log(error)
    // );
  }

  ngAfterViewInit() {
    this.card = elements.create('card');
    
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  browserDetection() {
    //console.log(this.deviceService.getDeviceInfo().browser);
    if(this.deviceService.getDeviceInfo().browser != "Chrome"){
      window.alert("We recommend using the Chrome browser in order to have the best KYC3 experience.");
    }
  }

  payWithEth() {
    if(this.eth == false){
      this.eth = true;
      this.btc = false;
      this.cc = false;
      this.token = false;
    }
    else {
      this.eth = false;
    }
    var div = document.getElementById("creditPayment") as HTMLDivElement;
    console.log(div);
    div.hidden = true;
    console.log("ETH Payment");
  }

  payWithToken() {
    if(this.token == false){
      this.token = true;
      this.eth = false;
      this.btc = false;
      this.cc = false;
    }
    else {
      this.token = false;
    }
    var div = document.getElementById("creditPayment") as HTMLDivElement;
    console.log(div);
    div.hidden = true;
    console.log("Token Payment");
  }

  payWithBtc() {
    if(this.btc == false){
      this.btc = true;
      this.eth = false;
      this.cc = false;
      this.token = false;
    }
    else {
      this.btc = false;
    }
    var div = document.getElementById("creditPayment") as HTMLDivElement;
    console.log(div);
    div.hidden = true;
    console.log("BTC Payment");
  }

  payWithCc() {
    if(this.cc == false){
      this.cc = true;
      this.eth = false;
      this.btc = false;
      this.token = false;
    }
    else {
      this.cc = false;
    }
    var div = document.getElementById("creditPayment") as HTMLDivElement;
    console.log(div);
    div.hidden = false;
    console.log("Credit card payment");
    //this.ngAfterViewInit();
  }

  currencySelected(){
    console.log(this.currency);
  }

  async paymentWithToken() {
    this.loading = true;
    console.log("Payment with token");

    if (wa.ethereum) {
      wa.web3 = new wa.Web3(wa.ethereum);
      try {
          await wa.ethereum.enable();
      } catch (error) {
          console.log(error);
          this.loading = false;
          return;
      }
    }
    else if (wa.web3) {
      wa.web3 = new wa.Web3(wa.web3.currentProvider);
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      this.loading = false;
      return;
    }

    let data = {
        wallet_address:wa.web3.eth.accounts[0],
        email_address:this.email,
    };

    let balance = this.tokensNo * WEI;
    $.ajax({
        url: '/token_api/userwallet',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(data) {
            if(data.status == "ok") {
              if (Token === undefined)
                Token = wa.web3.eth.contract(minABI).at(environment.tokenAddress);

              Token.transfer(environment.serverWalletAddress, balance, {
                from: wa.web3.eth.accounts[0],
              }, (error, transactionHash) => {
                if (error) {
                  console.log(error);
                  return;
                }

                console.log("Successfully Transfered" + balance + " IdeaCoin to: " + environment.serverWalletAddress + "!");
              });
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
  }

  async payment() {
    this.loading = true;
    console.log("Payment");
    console.log(this.walletAddress);
    if(this.tokensNo > 250){
        const initialState = {
            email: this.email,
            walletAddress: this.walletAddress,
            amount: this.tokensNo
        };
        this.bsModalRef = this.modalService.show(KYCModalComponent,{initialState});
        this.bsModalRef.content.closeBtnName = 'Close';
    } else {
        const { token, error } = await stripe.createToken(this.card, {
            email: this.email
            });
            this.model.stripetoken = token.id;
            this.model.email = this.email;
            this.model.amount = this.tokensNo;
            this.model.currency = this.currency;
            this.model.walletAddress = this.walletAddress;
            this.card.clear();
            this.callsService.payment(this.model).subscribe(
            data => {
                console.log(data);
                this.loading = false;
                window.scrollTo(0,0);
                this.alertService.success("Payment successful.");
                this.email = '';
                this.tokensNo = 1;
                this.walletAddress = '';
            },
            error => {
                console.log(error);
                this.loading = false;
                this.alertService.error("Payment not successful.");
            }
            );
    }
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

//   createWithoutStripe() {
//     this.userTest.username = 'petra@kyc3.com';
//     this.userTest.password = 'Test#2';
//     // this.callsService.createWithoutStripe(this.userTest).subscribe(
//     //   data => console.log(data),
//     //   error => console.log(error)
//     // );
//   }  

}

@Component({
    selector: 'modal-content',
    template: `
      <div class="modal-header">
        <h4 class="modal-title pull-left">KYC Needed</h4>
        <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
            <div class="col-md-12">
                    <p style="text-align: center">This purchase requires you to go through a KYC process. Please click the button below to start.</p>
                    <div style="height: 50px;"></div>
                    <div class="row">
                        <div class="col-md-4"></div>
                        <div class="col-md-4">
                            <button class="btn" (click)="startKyc()" style="background-color: #28a745;border: none;padding: 10px;color: white;">Start KYC process</button>
                        </div>
                        <div class="col-md-4"></div>
                    </div>
            </div>
        </div>
        <div style="height: 30px"></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
      </div>
    `
  })
   
  export class KYCModalComponent implements OnInit {
    title: string;
    closeBtnName: string;
    email: any;
    walletAddress: any;
    amount: any;
    tokensNo: any;
   
    constructor(
        public bsModalRef: BsModalRef,
        public router: Router
    ) {}
   
    ngOnInit() {
        console.log(this.email);
        console.log(this.walletAddress);
        console.log(this.amount);
    }

    startKyc() {
        console.log("KYC started");
        this.bsModalRef.hide();
        this.router.navigate(['/register'],{queryParams: {email: this.email,walletAddress: this.walletAddress,tokensNo: this.amount}});
    }
  }