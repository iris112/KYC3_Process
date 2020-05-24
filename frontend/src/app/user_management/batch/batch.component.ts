import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../_services';

/** 
 * Implements batch user importing (by uploading and parsing a csv file with user details) - not currently used
*/
@Component({
    moduleId: module.id,
    templateUrl: 'batch.component.html',
    styleUrls: ['./batch.component.css']
})

export class BatchComponent implements OnInit {

  error: string;

  model: any = {};
  loading = false;
  batchFileFilled = false;
  batchFileName: string;
  filenameBatchFile: string;
  batchFile: File = null;
  csv: string = "";

  constructor(
    private alertService: AlertService,
  ) {
  }

  ngOnInit(){
    //this.model = null;
  }

  /** 
  * Function that detects if batch file is filled
  */
  isBatchFileFilled(){
    this.batchFileFilled = true;
  }

  /** 
  * Function that opens batch file input window
  */
  openBatchFileInput(){
    (document.getElementById('batchFile') as HTMLInputElement).click();
  }

  /** 
  * Function that shows batch file name
  */
  showBatchFile(files: FileList){
      this.batchFile = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(this.batchFile);
      reader.onload = (e) => {
        this.csv = reader.result;
      }
      (document.getElementById("filenameBatchFile") as HTMLDivElement).innerHTML = this.batchFile.name;
  }

  /** 
  * Function that parses CSV
  */
  parseCsv(fileContent: string){
    var lines = fileContent.split("\n");
    for(var i = 0; i < lines.length; i++){
      var columns = lines[i].split(",");
      this.model.firstName = columns[0];
      this.model.lastName = columns[1];
      this.model.dateOfBirth = columns[2];
      this.model.address = columns[3];
      this.model.something = columns[4];
      this.model.somethingElse = columns[5];
      this.model = {};
    }
  }

  /** 
  * Function that sends parsed information to database
  */
  async process(form: NgForm) {
    this.loading = true;
    if(this.batchFileFilled){
      this.parseCsv(this.csv);
      this.loading = false;
    }
    else {
      this.loading = false;
      this.alertService.error("Please upload a batch file in CSV format.");
    }
  }

}

