
import 'rxjs/Rx';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import * as FileSaver from 'file-saver';
import { TranslateService } from 'ng2-translate';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { DataSource } from '@angular/cdk';
import {
    AfterViewChecked, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild,
    ViewContainerRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {
    MD_DIALOG_DATA, MdDialog, MdDialogConfig, MdDialogRef, MdPaginator
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ErrorMessages } from '../common/error-msgs';
import { DialogsService } from '../dialog/dialogs.service';
import { RegistrationService } from '../registration/registration.service';
import { BranchDetails, OrgAccount, OrgRegistration, RegistrationCategory } from './common';

@Component({
  selector: 'branch-details',
  templateUrl: 'branch-details.html',
  styleUrls:['company.profile.css']
})
export class BranchDetailsCompnent implements OnInit{

    @Input() public orgAccount:OrgAccount;
     public category=RegistrationCategory;
    form: FormGroup;
    accountId: any;
    paramsSub: any;
     @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor (private translate:TranslateService,private _registrationService:RegistrationService,private activatedRoute: ActivatedRoute,
                    public dialog: MdDialog,public viewContainerRef: ViewContainerRef,@Inject(FormBuilder) fb: FormBuilder,private formb: FormBuilder,){
        this.form = formb.group({
              rejectReason: [null],
              orgName: [null, Validators.required],
          });
    }

     branchDetailsForm: NgForm;
     @ViewChild('branchDetailsForm') currentForm: NgForm;
     lang: string = localStorage.getItem("localeId"); // language  
     hasError =false;
    ngOnInit() { 
           // this.paramsSub = this.activatedRoute.params.subscribe(params => {this.accountId = parseInt(params['id'], 10)});
           this.paramsSub = this.activatedRoute.params.subscribe(params => this.accountId = params['accountId']);
           this._registrationService.getBranchDetails(this.accountId).subscribe(data => {
           this.orgAccount = data;
        },
        error => console.log(error));

          if(this.orgAccount == undefined){
               console.log("Error Occured   "+this.hasError);
          }
          else {
          }


    }  


  openDetailDialog(registration:OrgRegistration){

      let dialogRef = this.dialog.open(BranchDetailDialog, {
        
         position:{top:'30px',left:'90px'},
          data:registration
      });
      dialogRef.afterClosed().subscribe(result => {
        dialogRef = null;
      });
  }

}

@Component({
  selector: 'detail-dialog',
  templateUrl: 'account-detail-dialog.html'
})

export class BranchDetailDialog {
  months:number;
  public form: FormGroup;
  public result: any;
  public category=RegistrationCategory;

  constructor(@Inject(MD_DIALOG_DATA) public data:OrgRegistration ,private fb: FormBuilder,
                   public dialogRef:MdDialogRef<BranchDetailDialog>,private dialogsService: DialogsService,
                   private _registrationService:RegistrationService)  { }
  

  
  public ngOnInit() {   
    this.months= this.getMonthsBetweenTwoDates(this.data.issueDateStr,this.data.expiryDateStr);

    this.form = this.fb.group({
      'registrationId': new FormControl({value: this.data.registrationId, hidden: true}, Validators.required),
      'issueDateStr':new FormControl({value: this.data.issueDateStr, disabled: true}),
      'expiryDateStr':new FormControl({value: this.data.expiryDateStr, disabled: true}),
      'companyministryNumber':new FormControl({value: this.data.companyministryNumber, disabled: true}),
      'companyName':new FormControl({value: this.data.companyName, disabled: true}),
      'number':new FormControl({value: this.data.number, disabled: true}),
      'category':new FormControl({value: this.data.category, hidden: true}),
      'subcategory':new FormControl({value: this.data.subcategory, hidden: true}),
      'notes':new FormControl({value: this.data.notes, disabled: true}),
      'ports':new FormControl({value: this.data.ports, disabled: true}),
      'attachmentId':new FormControl({value: this.data.attachmentId, hidden: true}),
       'months':new FormControl({value: this.months, disabled: true}),
    });
  }

  private getMonthsBetweenTwoDates(issueDateStr,expiryDateStr){
      var issueDate = issueDateStr.split("-");
      var expiryDate = issueDateStr.split("-");
      if(issueDate.length !=3 || expiryDate.length != 3){
        return 0;
      }
      var year = expiryDate[0]-issueDate[0];
      var month = expiryDate[0]-issueDate[0];
      return month + year*12;
  }


  public getTheFile(){
    this._registrationService.getExpectedRegistrationFile("1",this.data.registrationId,this.data.attachmentId).subscribe(res => {
        var blob = new Blob([res], { type: 'application/pdf' });
        FileSaver.saveAs(blob, "file_abc.pdf");    
      })
  }



  public openDialog() {    
      this.dialogsService
        .confirm('Confirm Dialog', 'Are you sure you want to do this?')
        .subscribe(res => this.result = res);
    }

}

