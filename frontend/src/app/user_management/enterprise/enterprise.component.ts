import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, CallsService } from '../../_services';
import { config } from '../../../assets/configuration';
import { chart } from 'highcharts';
import * as Highcharts from 'highcharts';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-select';
import 'datatables.net-buttons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { editUser } from '../../_models';
import {Image, CurrentImageConfig, PlainGalleryConfig,GalleryService, PlainGalleryStrategy, GridLayout, Description, DescriptionStrategy, PreviewConfig, ButtonsConfig, ButtonEvent, ButtonType, ButtonsStrategy} from '@ks89/angular-modal-gallery';
import { SlideConfig } from '@ks89/angular-modal-gallery/src/model/slide-config.interface';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { ImageLoadEvent } from '@ks89/angular-modal-gallery/src/components/current-image/current-image.component';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';

/** 
 * Implements the enterprise page
*/
@Component({
    moduleId: module.id,
    templateUrl: 'enterprise.component.html',
    styleUrls: [ './enterprise.component.css' ]
})

export class EnterpriseComponent implements OnInit, OnDestroy {
  
  model: any = {};
  editUser: any = editUser;
  loading = false;
  loadingCheck = false;
  displayBar = false;
  loadingImg = "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";
  progress: number = 22;
  companyName: string = config.companyName;
  userName: string = '';
  response: any = {};
  @ViewChild('pieChart') pieChart: ElementRef;
  chart: Highcharts.ChartObject;
  @ViewChild('barChart') barChart: ElementRef;
  @ViewChild('anotherChart') anotherChart: ElementRef;
  @ViewChild('editTemplate') editTemplate: TemplateRef<any>;
  @HostListener('document:keyup.esc',['$event'])
  onKeyupHandler(event: KeyboardEvent) {
    this.refreshTable();   
  }

  dataTable: any;
  allUsers: any[];
  users: any[];
  allUserstmp: any[];
  usersToCheckNo: any = 0;
  mainColor: string = config.mainColor;
  exportModal: BsModalRef;
  editModal: BsModalRef;
  evaluateModal: BsModalRef;
  exportOption: any = '';
  currency: any = '';
  currencyFilled: any = true;
  taxCountryFilled: any = true;
  adminsList: any = {};
  value: any = '';
  allSelected: any = false;

  constructor (
    private router: Router,
    private callsService: CallsService,
    private alertService: AlertService,
    private chRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private galleryService: GalleryService
  ){
  }
  
  ngOnInit() {
    this.userName = localStorage.getItem('username');
    this.getAllUserIdentityDocuments();
    this.getAllUser();
  }

  allUserDetails: any = {};


  openModalWithComponent() {
    var selected = (document.getElementsByClassName("selected") as HTMLCollectionOf<Element>);

    if(selected.length > 0){
        var usersToEvaluate = [];
        for(var i = 0; i < selected.length;i++){
          usersToEvaluate[i] = selected.item(i).getElementsByTagName('td').item(2).title;
        }
        console.log("Users to evaluate");
        console.log(usersToEvaluate);
        const initialState = {
          allUserDetails: this.allUserDetails,
          usersToEvaluate: usersToEvaluate
        };
        this.evaluateModal = this.modalService.show(GalleryModalComponent, {initialState});
        this.evaluateModal.content.closeBtnName = 'Close';
    }
  }

  refreshTable() {
    this.getAllUser();
    this.getAllUserIdentityDocuments();
  }

  
  getAllUserIdentityDocuments() {
    this.callsService.getAllUserDetails().subscribe(
      data => {
        if(data){
          console.log(data);
          this.allUserDetails = data;
        }
      },
      error => console.log(error)
    );
  }
    
  /** 
   * Function used to retreive details for a specific user
  */
  getAccount(username: any) { 
    this.callsService.getUserDetails(username).subscribe(
      data => { 
        this.model = data;
        console.log(this.model);
        this.editUser.firstName = this.model.firstName;
        this.editUser.lastName = this.model.lastName;
        this.editUser.email = this.model.email;
        this.editUser.dateOfBirth = this.model.details.dateOfBirth;
        this.editUser.nationality = this.model.details.nationality;
        this.editUser.address = this.model.details.address;
        this.editUser.taxCountry = this.model.details.taxCountry;
        this.editUser.amount = this.model.details.amount;
        this.editUser.currencyType = this.model.details.currencyType;
        this.editUser.walletAddress = this.model.details.walletAddress;
        this.editUser.sourceOfFunds = this.model.details.sourceOfFunds;
        this.editUser.password = this.model.password;
        this.editUser.userName = this.model.userName;
      },
      error => console.log(error)
    );
  }

  /** 
   * Function used to detect selected user name
  */
  getUserInfo(){
    var selected = (document.getElementsByClassName("selected") as HTMLCollectionOf<Element>);
    if(selected.length > 0 && selected.length < 2){
      var username = selected.item(0).getElementsByTagName('td').item(2).title;
      this.getAccount(username);
      this.displayEdit(this.editTemplate);
    }
    else {
      this.alertService.error('Please select exactly one user to edit.');
    }
  }

  /** 
   * Function used for setting a KYC status for a user
   * @param {any} userName - username to set KYC status for
   * @param {any} kycStatus - the value of KYC status (1 - Low Risk, 2 - Medium Risk, 3 - High Risk) 
  */
  setKYCStatus(userName: any, kycStatus: any){
    this.callsService.setKYCStatus(userName,kycStatus).subscribe(
      data => { 
      },
      error => {
        if(error.error.text == "done."){
            this.loadingCheck = false;
            this.displayBar = false;
            this.alertService.success("Changed status successfully.");
            // if(kycStatus == '1'){
            //   console.log("WHITELISTED");
            //   this.callsService.whitelisted(userName);
            // }
            // if(kycStatus == '2'){
            //   console.log("MORE INFORMATION");
            //   this.callsService.moreInformationNeeded(userName);
            // }
            // if(kycStatus == '3'){
            //   console.log("BLACKLISTED");
            //   this.callsService.blacklisted(userName);
            // }
            this.getAllUser();
            this.getAllUserIdentityDocuments();
        }
        else {
          this.alertService.error("Something went wrong.");
          this.loadingCheck = false;
          this.displayBar = false;
        }
      }
    );
  }

  /** 
   * Function for displaying the exporting modal window
  */
  displayExport(template: TemplateRef<any>){
    this.exportModal = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md' })
    );
  }

  /** 
   * Function for displaying the editing modal window
  */
  displayEdit(template: TemplateRef<any>){
    this.editModal = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-md' })
    );
  }

  /** 
   * Function for triggering the download of correct export file
   * @param {any} exportOption - the option that the user selected
  */
  export(exportOption: any){
    //console.log(exportOption);
    switch(exportOption) {
      case 'all': {this.exportAll();break;}
      case 'allUnchecked': {this.exportUnchecked();break;}
      case 'notStarted': {this.exportNotStarted();break;}
      case 'whitelist': {this.exportWhitelist();break;}
      case 'onHold': {this.exportOnHold();break;}
      case 'blacklist': {this.exportBlacklist();break;}
    }
  }
  
  kycStatus: any = [];
  countriesAll: any = [];
  sourcesOfFunds: any = [];
  ethAmounts: any = [];
  kycStatusForProgress: any = [];
  progressData: any = [];
  statuses: any = ["Not Started","Low Risk","Medium Risk","High Risk"];

/** 
 * Function for filtering out a user (admin in our case) so that they do not show in the table 
 * @param {any} userName - user that will be filtered out
*/
removeAdmin(userName: string, userArray: any){
  return userArray.filter(function (emp){
    if(emp.userName == userName){
      return false;
    }
    return true;
  });
}

/** 
 * Function for getting the information of all users - without files. Contains configuration of dataTables package.
*/
getAllUser() {
  // Getting users from the database
  this.callsService.getAllUser()
    .subscribe((data: any[]) => {
        // Removing the admin user
        this.users = data;
        console.log(this.users);
        // dataTables configuration
        this.chRef.detectChanges();
        const table: any = $('table');
        if ( $.fn.dataTable.isDataTable( '.table' ) ) {
          this.dataTable = table.DataTable();
        }
        else {
          this.dataTable = table.DataTable(
            {
                "oLanguage": { "sEmptyTable": "No users found."},
                "orderCellsTop": true,
                "columnDefs": [
                  { "orderable": false, "targets": 3 },
                  { "orderable": false, "targets": 4 },
                  { "orderable": false, "targets": 5 },
                  { "orderable": false, "targets": 6 },
                  { "orderable": false, "targets": 7 },
                  { "orderable": false, "targets": 8 },
                  { "orderable": false, "targets": 9 },
                  { "orderable": false, "targets": 11 },
                  { "orderable": false, "targets": 12 },
                  { "orderable": false, "targets": 13 },
                  { "orderable": false, "targets": 15 }
                ],
                "order": [],
                "paging": true,
                "lengthMenu": [[30,50,100,-1],[30,50,100,"All"]],
                "dom": '<"top"flp<"clear">>rt<"bottom"ip<"clear">>',
                "select": {style: "os"}
              }
          );
          
          // $('table thead tr').clone(true).appendTo( 'table thead' );
          // $('table thead tr:eq(1) th').each( function (i) {
          //     // var title = $(this).text();
          //     $(this).html( '<input type="text" style="width: 50%" />' );
       
          //     $( 'input', this ).on( 'keyup change', function () {
          //         var value = $( 'input', this )['prevObject'][0].value;
          //         if ( dataTable.column(i).search() !== value ) {
          //           dataTable
          //                 .column(i)
          //                 .search( value )
          //                 .draw();
          //         }
          //     } );
          // } );

          //var tableTest = $('table').DataTable();
            
            // Enable selection of rows
            $('tbody').on( 'click', 'tr', function () {
            $(this).toggleClass('selected');
          });

        }
        
        // Preparing data for graph input
        for(var i = 0, len= this.users.length;i < len; i++){
          this.kycStatus.push(this.users[i].status.kycStatus);
          this.countriesAll.push(this.users[i].details.taxCountry);
          this.sourcesOfFunds.push(this.users[i].details.sourceOfFunds);
          this.progressData.push({'status': this.users[i].status.kycStatus,'ethAmount': this.users[i].details.ethAmount})
          // this.ethAmounts.push(i+10);
          // this.kycStatusForProgress.push(this.users[i].status.kycStatus);
        }

        //console.log(this.progressData);

        // Drawing graphs
        if(this.users.length != 0){
          this.drawPie();
          this.drawBar();
          this.drawAnother();
          //this.drawProgress();
        }
      },
      error => {
        var messageError = "";
        if (error.error && error.error.messages) {
          error.error.messages.forEach((element, index, array) => {
            messageError += element.message + "\n";
          });
        } else {
          messageError = "Something went wrong. Please try again.";
        }
        this.alertService.error(messageError);
        this.router.navigate(['/login']);
      }
    );
     
  }

  /** 
   * Function for exporting users that are unchecked
  */
 exportUnchecked(){
    var csvData = 'ID,First Name,Last Name,Username,Email,Wallet Address,Amount,Currency\n';
    console.log(this.users);
    for(var i = 0; i < this.users.length; i++){
      if(this.users[i].status.mrz == null){
        csvData += (this.users[i].id + "," + this.users[i].firstName + "," + this.users[i].lastName + "," + this.users[i].userName + "," + this.users[i].email + "," + this.users[i].details.walletAddress + "," + this.users[i].details.amount + "," + this.users[i].details.currencyType + "\n");
      }
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'notchecked.csv';
    hiddenElement.click();
  }

  /** 
   * Function for exporting users that are on the whitelist (have a risk of Low) 
  */
 exportWhitelist(){
    var csvData = 'ID,First Name,Last Name,Username,Email,Wallet Address,Amount,Currency\n';
    console.log(this.users);
    for(var i = 0; i < this.users.length; i++){
      if(this.users[i].status.kycStatus == '1'){
        csvData += (this.users[i].id + "," + this.users[i].firstName + "," + this.users[i].lastName + "," + this.users[i].userName + "," + this.users[i].email + "," + this.users[i].details.walletAddress + "," + this.users[i].details.amount + "," + this.users[i].details.currencyType + "\n");
      }
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'whitelist.csv';
    hiddenElement.click();
  }

  /** 
   * Function for exporting users that are on the blacklist (have a risk of High) 
  */
 exportBlacklist(){
    var csvData = 'ID,First Name,Last Name,Username,Email,Wallet Address,Amount,Currency\n';
    console.log(this.users);
    for(var i = 0; i < this.users.length; i++){
      if(this.users[i].status.kycStatus == '3'){
        csvData += (this.users[i].id + "," + this.users[i].firstName + "," + this.users[i].lastName + "," + this.users[i].userName + "," + this.users[i].email + "," + this.users[i].details.walletAddress + "," + this.users[i].details.amount + "," + this.users[i].details.currencyType + "\n");
      }
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'blacklist.csv';
    hiddenElement.click();
  }

  /** 
   * Function for exporting users that are on hold (have a risk of Medium) 
  */
 exportOnHold(){
    var csvData = 'ID,First Name,Last Name,Username,Email,Wallet Address,Amount,Currency\n';
    console.log(this.users);
    for(var i = 0; i < this.users.length; i++){
      if(this.users[i].status.kycStatus == '2'){
        csvData += (this.users[i].id + "," + this.users[i].firstName + "," + this.users[i].lastName + "," + this.users[i].userName + "," + this.users[i].email + "," + this.users[i].details.walletAddress + "," + this.users[i].details.amount + "," + this.users[i].details.currencyType + "\n");
      }
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'onhold.csv';
    hiddenElement.click();
  }

  /** 
   * Function for exporting users that are not started (have a status of Not Started)
  */
 exportNotStarted(){
  var csvData = 'ID,First Name,Last Name,Username,Email,Wallet Address,Amount,Currency\n';
  console.log(this.users);
  for(var i = 0; i < this.users.length; i++){
    if(this.users[i].status.kycStatus == '0'){
      csvData += (this.users[i].id + "," + this.users[i].firstName + "," + this.users[i].lastName + "," + this.users[i].userName + "," + this.users[i].email + "," + this.users[i].details.walletAddress + "," + this.users[i].details.amount + "," + this.users[i].details.currencyType + "\n");
    }
  }
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'notstarted.csv';
  hiddenElement.click();
}

  /** 
   * Function for exporting all users
  */
 exportAll(){
    var csvData = 'ID,First Name,Last Name,Username,Email,Wallet Address,Amount,Currency\n';
    console.log(this.users);
    for(var i = 0; i < this.users.length; i++){
      csvData += (this.users[i].id + "," + this.users[i].firstName + "," + this.users[i].lastName + "," + this.users[i].userName + "," + this.users[i].email + "," + this.users[i].details.walletAddress + "," + this.users[i].details.amount + "," + this.users[i].details.currencyType + "\n");
    }
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'users.csv';
    hiddenElement.click();
  }

  exportSelected(){
    var usersToExport = [];
    var selected = (document.getElementsByClassName("selected") as HTMLCollectionOf<Element>);
    if(selected.length > 0){
        usersToExport = [];
        for(var i = 0; i < selected.length;i++){
          usersToExport[i] = selected.item(i).getElementsByTagName('td').item(2).title;
        }
        this.usersToCheckNo = usersToExport.length;
        console.log("Users to export");
        console.log(usersToExport);
        var csvData = 'ID,First Name,Last Name,Username,Email,Wallet Address,Amount,Currency\n';
        for(var i = 0; i < this.users.length;   i++){
          if(usersToExport.indexOf(this.users[i].userName) != -1){
            csvData += (this.users[i].id + "," + this.users[i].firstName + "," + this.users[i].lastName + "," + this.users[i].userName + "," + this.users[i].email + "," + this.users[i].details.walletAddress + "," + this.users[i].details.amount + "," + this.users[i].details.currencyType + "\n");
          }
        }
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'export.csv';
        hiddenElement.click();
    }
    else {
      window.scroll(0,0);
      this.alertService.error("Please select at least one user to export.");
    }

   
  }
  
  selectAll(){
    var tr = document.getElementsByTagName('tr') as HTMLCollectionOf<HTMLTableRowElement>;
    console.log(tr);
    for(var i = 1; i < tr.length; i++){
      tr[i].classList.add('selected');
    }
    this.allSelected = true;
  }

  deselectAll(){
    var tr = document.getElementsByTagName('tr') as HTMLCollectionOf<HTMLTableRowElement>;
    console.log(tr);
    for(var i = 1; i < tr.length; i++){
      tr[i].classList.remove('selected');
    }
    this.allSelected = false;
  }


  /** 
   * Function for performing checks on selected users.
  */
  checkUsers(){
    this.loadingCheck = true;
    console.log("Check users triggered");
    var usersToCheck = [];
    var selected = (document.getElementsByClassName("selected") as HTMLCollectionOf<Element>);

    if(selected.length > 0){
        usersToCheck = [];
        for(var i = 0; i < selected.length;i++){
          usersToCheck[i] = selected.item(i).getElementsByTagName('td').item(2).title;
        }
        this.usersToCheckNo = usersToCheck.length;
        this.displayBar = true;
        this.callsService.evalList(usersToCheck).subscribe(
          data => {
            if (data!=null) {
              if(data == usersToCheck.length){
                this.loadingCheck = false;
                this.displayBar = false;
                this.alertService.success("Check successful.");
                this.getAllUser();
                this.getAllUserIdentityDocuments();
              }
            } else {
              this.alertService.error("Something went wrong.");
              this.loadingCheck = false;
              this.displayBar = false;
            }
          },
          error => {
            this.alertService.error("Something went wrong.");
            this.loadingCheck = false;
            this.displayBar = false;
            console.log(error);
          }
        );
    }
    this.loadingCheck = false;
  }

  /** 
   * Function for deleting a user.
  */
 deleteUser(){
  var selected = (document.getElementsByClassName("selected") as HTMLCollectionOf<Element>);
  var userName = '';

  if(selected.length == 1){
      userName = selected.item(0).getElementsByTagName('td').item(2).title;
      console.log("Delete user " + userName);
      if(window.confirm("Are you sure you want to delete user " + userName + " ?")){
        this.callsService.deleteUser(userName).subscribe(
          data => {
            if (data!=null) {
            }
          },
          error => {
            console.log(error.error.text);
            if(error.error.text == "Success."){
              this.alertService.success("User was deleted.");
              this.getAllUser();
            }
            else {
              this.alertService.error("Something went wrong.");
              console.log(error);
            }
          }
        );
      }
      else {
        selected.item(0).classList.remove("selected");

      }
  }
  else {
    this.alertService.error("Please select exactly one user to delete.");
  }
}

/** 
* Function used to detect whether currency has been chosen
*/
isCurrencyFilled(){
  this.currencyFilled = true;
  if (this.editUser.currencyType == 'EUR' || this.editUser.currencyType == 'USD' ) {
      this.currency = '';
  }
  else {
      this.currency = this.editUser.currencyType;
  } 
}

/** 
* Function used for detecting if tax country address is filled
*/
isTaxCountryFilled(){
  this.taxCountryFilled = true;
}


saveUser(){
  this.callsService.editUser(this.editUser)
    .subscribe(
      data => {
        this.editModal.hide();
        this.alertService.success("Changes saved successfully.");
        this.getAllUser();
      },
      error => {
        console.log(error);
        this.editModal.hide();
        this.alertService.error("Something went wrong.");
      }
    );
}

  /** 
   * Function for preparing data for pie chart
   * @param arr - array of KYC statuses
   * @returns {[]} - pie data array
  */
  preparePie (arr) {
    var colors = [];
    var names = [], y = [], prev;
    
    // Taking the array of result topics and counting the occurences
    arr.sort();
    for ( var i = 0, len = arr.length; i < len; i++ ) {
        if ( arr[i] !== prev ) {
            names.push(arr[i]);
            y.push(1);
        } else {
            y[y.length-1]++;
        }
        prev = arr[i];
    }

    // Setting the correct colors for the correct status
    for (var k=0;k<names.length;k++){
      if (names[k] == 0) {
        names[k] = "Not Started";
        colors[k] = "#bdbdbd";
     } else if (names[k] == 1) {
        names[k] = "Low";
        colors[k] = "#72C245";
     } else if (names[k] == 2) {
        names[k] = "Medium";
        colors[k] = "#FDD32B";
     } else {
        names[k]="High";
        colors[k] = "#D60000";
     }
    }

    // Putting the data in the correct format for highcharts - JSON
    var pieData = [];
    for ( var j = 0, length = y.length; j < length; j++ ) {
      y[j] = Math.floor((y[j] / arr.length ) * 100);
      pieData.push({"name": names[j], "color": colors[j], "y": y[j]});
    }

    return pieData;
  }

  /** 
   * Function for preparing data for bar chart
   * @param arr - array of tax countries
   * @returns {[]} - bar data array
   * @returns {[]} - countries data array
  */
  prepareBar (arr) {
    
    var countries = [], barData = [], prev;

    // Counting occurrences of each country
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
      if ( arr[i] !== prev ) {
        countries.push(arr[i]);
          barData.push(1);
      } else {
        barData[barData.length-1]++;
      }
      prev = arr[i];
    }

    return [countries,barData];
  }

  /** 
   * Function for preparing data for the other pie chart
   * @param arr - array of sources of funds
   * @returns {[]} - pie data array
  */
  prepareAnother (arr) {

    var names = [], y = [], prev;
    
    // Counting occurrences of each source of funds
    arr.sort();
    for ( var i = 0, len = arr.length; i < len; i++ ) {
        if ( arr[i] !== prev ) {
            names.push(arr[i]);
            y.push(1);
        } else {
            y[y.length-1]++;
        }
        prev = arr[i];
    }

    // Preparing the correct data format for highcharts - JSON
    var pieData = [];
    for ( var j = 0, length = y.length; j < length; j++ ) {
      y[j] = Math.floor((y[j] / arr.length ) * 100);
      pieData.push({"name": names[j], "y": y[j]});
    }

    return pieData;
  }

  /** 
   * Function for preparing data for the progress bar chart
   * @param arr - array of kyc statuses and ETH amounts
   * @returns {[]} - bar data array
  */
  // prepareProgress(arr){
  //   var notStartedETH = 0,lowETH = 0, mediumETH = 0, highETH = 0;
  //   for (var i = 0; i < arr.length; i++) {
  //     console.log(arr[i]['status']);
  //     if (arr[i]['status'] == 0){
  //       notStartedETH += arr[i]['ethAmount'];
  //     }
  //     else if (arr[i]['status'] == 1){
  //       lowETH += arr[i]['ethAmount'];
  //     }
  //     else if (arr[i]['status'] == 2){
  //       mediumETH += arr[i]['ethAmount'];
  //     }
  //     else {highETH += arr[i]['ethAmount'];}
  //   }

  //   var barData = [];
  //   barData.push({'name': 'High Risk', 'data': [highETH], 'color': '#D60000'});
  //   barData.push({'name': 'Medium Risk', 'data': [mediumETH], 'color': '#FDD32B'});
  //   barData.push({'name': 'Low Risk', 'data': [lowETH], 'color': '#72C245'});
  //   barData.push({'name': 'Not Started', 'data': [notStartedETH], 'color': '#bdbdbd'});
  //   return barData;
  // }

  /** 
   * Function for drawing bar chart. Contains highcharts configuration.
  */
  drawBar () {
   var barData = [];
   barData = this.prepareBar(this.countriesAll);
   const optionsBar: Highcharts.Options = {
      chart: {
        height: '300',
        type: 'column',
      },
      colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce','#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
      title: {
          text: 'Tax Countries Distribution',
          style: {
            color: 'black',
            fontSize: '14px',
          }
      },
      xAxis: {
          categories: barData[0],
          title: {
              text: 'Tax Country'
          }
      },
      yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
              text: 'Number of people',
              align: 'middle'
          },
          labels: {
              overflow: 'justify'
          }
      },
      legend: {
        enabled: false
      },
      tooltip: {
          pointFormat: "<b>{point.y}</b> user(s)<br/>",
      },
      plotOptions: {
        column: {
          tooltip: {

          },
          colorByPoint: true,
          dataLabels: {
            enabled: false
          }
        }
      },
      credits: {
          enabled: false
      },
      series: [{
          name: null,
          data: barData[1]
      }]
    }

    this.chart=chart(this.barChart.nativeElement, optionsBar);
    barData = [];
    this.countriesAll = [];
  }

  /** 
   * Function for drawing pie chart. Contains highcharts configuration.
  */
  drawPie(){
    const optionsPie: Highcharts.Options = {
      chart: {
        height: '300',
        type: 'pie'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Overview of KYC status',
        style: {
          color: 'black',
          fontSize: '14px',
        }
      },
      point: {
        events: {
          legendItemClick: function () {
            return false;
          }
        }
      },
      colors: ['#bdbdbd', '#72C245', '#FDD32B', '#D60000'],
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'default',
          dataLabels: {
            enabled: false
          },
          point:{
            events : {
             legendItemClick: function(e){
                 e.preventDefault();
             }
            }
        },
          showInLegend: true
        }
      },
      series: [{
        name: "%",
        data: this.preparePie(this.kycStatus)
    }]
    };

    this.chart=chart(this.pieChart.nativeElement, optionsPie);
    this.kycStatus = []; 
  }

  /** 
   * Function for drawing the other pie chart. Contains highcharts configuration.
  */
  drawAnother(){
    const optionsAnother: Highcharts.Options = {
      chart: {
        height: '300',
        type: 'pie'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Sources of Funds Overview',
        style: {
          color: 'black',
          fontSize: '14px',
        }
      },
      point: {
        events: {
          legendItemClick: function () {
            return false;
          }
        }
      },
      colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce','#492970', '#f28f43', '#77a1e5'],
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'default',
          dataLabels: {
            enabled: false
          },
          point:{
            events : {
             legendItemClick: function(e){
                 e.preventDefault();
             }
            }
        },
          showInLegend: true
        }
      },
      series: [{
        name: "%",
        data: this.prepareAnother(this.sourcesOfFunds)
    }]
    };

    this.chart=chart(this.anotherChart.nativeElement, optionsAnother);
    this.sourcesOfFunds = []; 
  }

  /** 
   * Function for drawing the progress chart. Contains highcharts configuration.
  */
//  drawProgress(){
//   this.prepareProgress(this.progressData);
//   const optionsProgress: Highcharts.Options = {
//       chart: {
//         type: 'bar',
//         height: 200
//     },
//     credits: {
//       enabled: false
//     },
//     tooltip: {
//       pointFormat: "{series.name}: {point.y} ETH</span><br/>"
//     },
//     title: {
//         text: 'Distribution of ETH in different KYC status categories',
//         style: {
//           color: 'black',
//           fontSize: '14px',
//         }
//     },
//     xAxis: {
//         categories: ['']
//     },
//     yAxis: {
//       title: {
//         text: 'ETH Amount'
//       },
//       allowDecimals: false
//     },
//     legend: {
//         reversed: true
//     },
//     plotOptions: {
//         series: {
//             stacking: 'stacked'
//         }
//     },
//     series: this.prepareProgress(this.progressData)
//   }

//   this.chart=chart(this.progressChart.nativeElement, optionsProgress);
//   this.progressData = [];
// }
  
  // drawStackedBar(){
  //     const optionsStackedBar: Highcharts.Options = {
  //       chart: {
  //         type: 'column'
  //     },credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: 'Results of MRZ check per country',
  //       style: {
  //         color: 'black',
  //         fontSize: '14px',
  //       }
  //     },
  //     colors: ['#bdbdbd', '#D60000', '#72C245'],
  //     xAxis: {
  //         title: { text: 'Countries', style: { fontWeight: 'bold'}},
  //         categories: ['Luxembourg', 'Germany', 'France', 'China', 'Russia','Italy','Czech Republic', 'United States', 'United Kingdom', 'Netherlands', 'Hungary', 'Poland']
  //     },
  //     yAxis: {
  //         min: 0,
  //         title: {
  //             text: 'Amount',
  //             style: { fontWeight: 'bold'}
  //         },
  //         stackLabels: {
  //             enabled: true,
  //             style: {
  //                 fontWeight: 'bold',
  //                 color: 'gray'
  //             }
  //         }
  //     },
  //     legend: {
  //         align: 'right',
  //         x: -30,
  //         verticalAlign: 'top',
  //         y: 25,
  //         floating: true,
  //         backgroundColor: 'white',
  //         borderColor: '#CCC',
  //         borderWidth: 1,
  //         shadow: false
  //     },
  //     tooltip: {
  //         headerFormat: '<b>{point.x}</b><br/>',
  //         pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  //     },
  //     plotOptions: {
  //         column: {
  //             stacking: 'normal',
  //             dataLabels: {
  //                 enabled: true,
  //                 color: 'white'
  //             }
  //         }
  //     },
  //     series: [{
  //         name: 'Not readable',
  //         data: [5, 3, 4, 7, 2, 3, 4, 6, 3, 1, 1, 2]
  //     }, {
  //         name: 'Incomplete',
  //         data: [2, 2, 3, 2, 1, 4, 3, 2, 5, 2, 3, 4]
  //     }, {
  //         name: 'Complete',
  //         data: [3, 5, 3, 1, 7, 3, 3, 2, 2, 7, 6, 4]
  //     }]
  //   };

  //     this.chart=chart(this.stackedBarChart.nativeElement, optionsStackedBar);
  // }


  ngOnDestroy(){
    this.pieChart = null;
    this.barChart = null;
    this.anotherChart = null;
  }

}
 
@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">Select document type</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      Select which type of documents you would like to evaluate:<br>
      <div style="height: 15px;"></div>
      <div *ngFor="let source of sources" class="source-item">
      <div style="margin-left: 20px">
        <input (change)="getSelected()" type="checkbox"
                name="sources"
                value="{{source.id}}"
                [(ngModel)]="source.selected" (ngModelChange)="sourceFilter()"/> 
        <span class="source-text">&nbsp;&nbsp;{{source.name}}</span>
        <div style="height: 13px;"></div>
      </div> 
      </div>
      <ks-modal-gallery [id]="0" [modalImages]="images" [plainGalleryConfig]="plainGalleryGrid" [previewConfig]="previewConfig" [slideConfig]="slideConfig" [buttonsConfig]="customButtonsConfig"
      (buttonBeforeHook)="onCustomButtonBeforeHook($event)"
  (buttonAfterHook)="onCustomButtonAfterHook($event)" [enableCloseOutside]="false"></ks-modal-gallery>
    </div>
    <div class="modal-footer">
      <button type="button" clas="btn btn-primary" style="color: white;background-color: #1F4694;border:none;padding: 10px;" (click)="evaluate()">Evaluate</button>
    </div>
  `
})
 
export class GalleryModalComponent implements OnInit {
  closeBtnName: string;
  allUserDetails: any = {};
  usersToEvaluate: any = [];
  selected_count: number = 0;
  selected_sources: any;
  sources: any = [{'name': 'All Documents','id': 'allDocuments','selected': false},{'name': 'Identity Documents','id': 'identityDocuments','selected': false},{'name': 'Proof of Residence','id':'proofOfResidence','selected': false}];

  base64Image: SafeResourceUrl;
  images: Image[] = [];
 
  constructor(public bsModalRef: BsModalRef,private modalService: BsModalService,public galleryService: GalleryService,public sanitizer: DomSanitizer, private callsService: CallsService) {}
 
  ngOnInit() {
    console.log(this.allUserDetails);
    console.log(this.usersToEvaluate);
    
  }

  plainGalleryGrid: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.GRID,
    layout: new GridLayout({ width: '240px', height: 'auto' }, { length: 3, wrap: false })
  };

  slideConfig: SlideConfig = {
    infinite: true, 
    sidePreviews: {
      size: {
        width: '90px',
        height: 'auto'
      },
      show: false
    }
  }

  customButtonsConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fa fa-check green',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom plus aria label',
        title: 'Approve',
        fontSize: '60px',
      },{
        className: 'fa fa-arrow-up yellow',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom plus aria label',
        title: 'Further Research',
        fontSize: '60px'
      },{
        className: 'fa fa-ban crimson',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom plus aria label',
        title: 'Reject',
        fontSize: '60px'
      },{
        className: 'fa fa-arrows-alt gray',
        type: ButtonType.FULLSCREEN,
        ariaLabel: 'custom plus aria label',
        title: 'Full Screen',
        fontSize: '50px'
      }
    ]
  };

  previewConfig: PreviewConfig = {
    visible:  true,
    number: 10,
    size: { width: '100px', height: 'auto'}
  }

  getSelected() {
   this.selected_sources = this.sources.filter(s => {
     return s.selected;
   });
   this.selected_count = this.selected_sources.length;
  }

  sourceFilter() {
    this.getSelected();  
  }

  selectedDocuments: any = [];
  evaluate() {
    this.galleryService.openGallery(0,0);
    console.log("selected sources");
    console.log(this.selected_sources);
    for(var k = 0; k < this.selected_sources.length; k++){
      this.selectedDocuments.push(this.selected_sources[k].name);
    }
    console.log("Selected sources names");
    console.log(this.selectedDocuments);
    console.log("Users to evaluate");
    console.log(this.usersToEvaluate);
    //this.bsModalRef.hide();
    var j = 0;
    for(var i = 0; i < this.allUserDetails.length; i++){
      if(this.allUserDetails[i].roles[0].roleName != 'admin'){
        if(this.usersToEvaluate.indexOf(this.allUserDetails[i].username) != -1){
          if(this.selectedDocuments.indexOf("All Documents") != -1){
            j++;
            var base64String = 'data:image/png;base64,' + this.allUserDetails[i].details.passportFront;
            this.base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
            console.log(this.allUserDetails[i].status.identityDocumentStatus);
            this.images.push(new Image(j,{
              img: this.base64Image,
              title: this.allUserDetails[i].username,
              description: this.allUserDetails[i].username + " - Passport Front",
              alt: this.allUserDetails[i].status.identityDocumentStatus
            }));
            if(this.allUserDetails[i].details.passportBack != null && this.allUserDetails[i].details.passportBack != undefined && this.allUserDetails[i].details.passportBack != ''){
              j++;
              var base64String = 'data:image/png;base64,' + this.allUserDetails[i].details.passportBack;
              this.base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
              this.images.push(new Image(j,{
                img: this.base64Image,
                title: this.allUserDetails[i].username,
                description: this.allUserDetails[i].username + " - Passport Back",
                alt: this.allUserDetails[i].status.identityDocumentStatus
              }));
            }
            j++;
            var base64String = 'data:image/png;base64,' + this.allUserDetails[i].details.proofOfResidence;
            this.base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
            this.images.push(new Image(j,{
              img: this.base64Image,
              title: this.allUserDetails[i].username,
              description: this.allUserDetails[i].username + " - Proof of Residence",
              alt: this.allUserDetails[i].status.proofOfResidenceStatus
            }));
          }
          if(this.selectedDocuments.indexOf("Identity Documents") != -1){
            j++;
            var base64String = 'data:image/png;base64,' + this.allUserDetails[i].details.passportFront;
            this.base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
            this.images.push(new Image(j,{
              img: this.base64Image,
              title: this.allUserDetails[i].username,
              description: this.allUserDetails[i].username + " - Passport Front",
              alt: this.allUserDetails[i].status.identityDocumentStatus
            }));
            if(this.allUserDetails[i].details.passportBack != null && this.allUserDetails[i].details.passportBack != undefined && this.allUserDetails[i].details.passportBack != ''){
              j++;
              var base64String = 'data:image/png;base64,' + this.allUserDetails[i].details.passportBack;
              this.base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
              this.images.push(new Image(j,{
                img: this.base64Image,
                title: this.allUserDetails[i].username,
                description: this.allUserDetails[i].username + " - Passport Back",
                alt: this.allUserDetails[i].status.identityDocumentStatus
              }));
            }
          }
          if(this.selectedDocuments.indexOf("Proof of Residence") != -1){
            j++;
            var base64String = 'data:image/png;base64,' + this.allUserDetails[i].details.proofOfResidence;
            this.base64Image = this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
            this.images.push(new Image(j,{
              img: this.base64Image,
              title: this.allUserDetails[i].username,
              description: this.allUserDetails[i].username + " - Proof of Residence",
              alt: this.allUserDetails[i].status.proofOfResidenceStatus
            }));
          }
        }
      }
    }
    // console.log("Images in gallery");
    // console.log(this.images);
    // for(var i = 0; i < images.length; i++){
    //   console.log("IMAGE");
    //   console.log(images[i].alt);
    //   if(images[i].alt == 'approve'){
    //     images[i].setAttribute('style','border: 3px solid crimson;');
    //   }
    //   if(images[i].alt == 'further'){
    //     images[i].setAttribute('style','border: 3px solid #f8cc20;');
    //   }
    //   if(images[i].alt == 'reject'){
    //     images[i].setAttribute('style','border: 3px solid green;');
    //   }
    // }
    var div = document.getElementsByClassName('modal-dialog') as HTMLCollectionOf<HTMLDivElement>;
    div[0].setAttribute('style','margin-left: 0px;margin-top: 0px;');
    this.galleryService.openGallery(0,0);
    
  }

  onCustomButtonBeforeHook(event: ButtonEvent) {
    // use before hook to get click on buttons
    // for custom buttons, you have to check event with your logic
    //console.log('onCustomButtonBeforeHook ', event);
    if(event && event.button && event.button.title){
      console.log(event.image.modal.alt);
      if(event.button.title == 'Approve'){
        this.approveDocument(event.image.modal.title,event.image.modal.description);
      }
      if(event.button.title == 'Reject'){
        this.rejectDocument(event.image.modal.title,event.image.modal.description);
      }
      if(event.button.title == 'Further Research'){
        this.furtherDocument(event.image.modal.title,event.image.modal.description);
      }
    }
    if (!event || !event.button) {
      return;
    }
    // Invoked after a click on a button, but before that the related
    // action is applied.
  }

  onCustomButtonAfterHook(event: ButtonEvent) {
    // use after hook to get click on buttons
    // for custom buttons, you have to check event with your logic
    console.log('onCustomButtonAfterHook ', event);
    if(event && event.button && event.button.title){
      //console.log(event.button.title);
      if(event.button.title == 'Close'){
        console.log("Modal closed");
        this.bsModalRef.hide();
      }
    }
    if (!event || !event.button) {
      return;
    }
    // Invoked after both a click on a button and its related action.
  }

  rejectDocument(imageId: any, description: any) {
    var split = [];
    split = description.split(' ');
    if(split.length == 5){
      this.callsService.setProofOfResidenceStatus(imageId,"reject").subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    }
    else {
      this.callsService.setIdentityDocumentStatus(imageId,"reject").subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    }
    $('.inside.preview-image.active')[0].setAttribute("style","border: 3px solid crimson;height: auto;width: 100px;");
    $('.right-arrow-image')[0].click();
  }

  approveDocument(imageId: any, description: any) {
    var split = [];
    split = description.split(' ');
    if(split.length == 5){
      this.callsService.setProofOfResidenceStatus(imageId,"approve").subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    }
    else {
      this.callsService.setIdentityDocumentStatus(imageId,"approve").subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    }
    $('.inside.preview-image.active')[0].setAttribute("style","border: 3px solid green;height: auto;width: 100px;");
    $('.right-arrow-image')[0].click();
  }

  furtherDocument(imageId: any, description: any) {
    var split = [];
    split = description.split(' ');
    if(split.length == 5){
      this.callsService.setProofOfResidenceStatus(imageId,"further").subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    }
    else {
      this.callsService.setIdentityDocumentStatus(imageId,"further").subscribe(
        data => console.log(data),
        error => console.log(error)
      );
    }
    $('.inside.preview-image.active')[0].setAttribute("style","border: 3px solid #f8cc20;height: auto;width: 100px;");
    $('.right-arrow-image')[0].click();
  }




}


