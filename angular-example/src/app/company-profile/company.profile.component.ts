
import * as FileSaver from 'file-saver';
import { TranslateService } from 'ng2-translate';

import { Component, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ErrorMessages } from '../common/error-msgs';
import { DialogsService } from '../dialog/dialogs.service';
import { ILookup, IPort } from '../registration/registration-common';
import { RegistrationService } from '../registration/registration.service';
import { OrgAccount, OrgRegistration, Port, RegistrationCategory } from './common';

@Component({
  selector: 'org-profile',
  templateUrl: 'company.profile.html',
  styleUrls:['company.profile.css']
})
export class CompanyProfileComponent implements OnInit {
  id: any;
  public account:OrgAccount;
  lang =  localStorage.getItem('localeId');
  hasError =false;
  category = RegistrationCategory;

  form: FormGroup;
  errorMessages =ErrorMessages;
  successful:boolean;
  fail:boolean;
  businessConstraintFailure:boolean;
 
  constructor (private translate:TranslateService,private _registrationService:RegistrationService,private activatedRoute: ActivatedRoute,
                    public dialog: MdDialog,public viewContainerRef: ViewContainerRef,@Inject(FormBuilder) fb: FormBuilder){
 
          

  }



  ngOnInit() {
            this.successful =false;
            this.fail= false;
            this.businessConstraintFailure =false;
 
            this._registrationService.getAccount(this.id).subscribe(
            data =>   this.account = data,            
            error => { this.hasError = true ;console.log(error);}  )     

     
  }




/**
 * Open th dialog of selected registration 
 * @param registration 
 */
  openDetailDialog(registration:OrgRegistration){
      let dialogRef = this.dialog.open(DetailDialog, {
          height: '400px',
          width: '600px',
          hasBackdrop: true,

          position:{top:'30px',right:'90px'},data:registration
      });
      dialogRef.afterClosed().subscribe(result => {
        dialogRef = null;
      });
  }

}



@Component({
  selector: 'detail-dialog',
  templateUrl: 'company.profile-detail-dialog.html',
  styleUrls:['company.profile.css']
})

export class DetailDialog {
  constructor(@Inject(MD_DIALOG_DATA) public data:OrgRegistration ,private fb: FormBuilder,
                   public dialogRef:MdDialogRef<DetailDialog>,private dialogsService: DialogsService,
                   private _registrationService:RegistrationService)  { }
  public subCategoryONE: ILookup[];
  public form: FormGroup;
  public result: any;
  public category=RegistrationCategory;
  public hideUpdate:string="show";
  public ports: IPort[];
  public ngOnInit() {
          if(this.data.category == 5){
          this._registrationService.getOneCategories().subscribe(x => {
               this.subCategoryONE = [].concat(x); }, err => {
            });
          }
          else if(this.data.category == 6){
            this._registrationService.getCustomCategories().subscribe(x => {
               this.subCategoryONE = [].concat(x); }, err => {
            });
          }
          else if(this.data.category == 4){
            this._registrationService.getPortAuthorityCategories().subscribe(x => {
               this.subCategoryONE = [].concat(x); }, err => {
            });
          }
            this._registrationService.getPorts().subscribe(x => {
               this.ports = [].concat(x); }, err => {
            });

    this.form = this.fb.group({
      'registrationId': new FormControl({value: this.data.registrationId, hidden: true}, Validators.required),
      'issueDateStr':new FormControl({value: this.data.issueDateStr, disabled: true}),
      'expiryDateStr':new FormControl({value: this.data.expiryDateStr, disabled: true}),
      'companyministryNumber':new FormControl({value: this.data.companyministryNumber, disabled: true}),
      'companyName':new FormControl({value: this.data.companyName, disabled: true}),
      'number':new FormControl({value: this.data.number, disabled: true}),
      'category':new FormControl({value: this.data.category, hidden: true}),
      'subcategory':new FormControl({value: this.data.subcategory}),
      'notes':new FormControl({value: this.data.notes, disabled: true}),
      'ports':new FormControl({value: this.data.ports, disabled: true}),
      'attachmentId':new FormControl({value: this.data.attachmentId, hidden: true}),
       'lockStatus':new FormControl({value: this.data.lockStatus, hidden: true}),
       'months':new FormControl({value: this.getMonthsBetweenTwoDates(this.data.issueDateStr,this.data.expiryDateStr), disabled: true}),
    });

    if(this.data.lockStatus){
        this.hideUpdate="hide";
    }

  }

  private getMonthsBetweenTwoDates(issueDateStr,expiryDateStr){
      var issueDate = issueDateStr.split("-");
      var expiryDate = issueDateStr.split("-");
      if(issueDate.length !=3 || expiryDate.length != 3){
        return 0;
      }
      var year = expiryDate[0]-issueDate[0];
      var month = expiryDate[0]-issueDate[0];
      return (month + year*12);
  }


  public getTheFile(){
    this._registrationService.getexpectedRegistrationFile("1",this.data.registrationId,this.data.attachmentId).subscribe(res => {
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