
import { Component,OnInit,ViewChild,Input,Inject,ViewContainerRef } from '@angular/core';
import { RegistrationService } from '../registration/registration.service'
import { ExpectedAccount } from './common'
import {TranslateService} from 'ng2-translate';
import {DataSource} from '@angular/cdk';
import 'rxjs/Rx' ;
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator}  from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA,MdDialogConfig} from '@angular/material';
import {ErrorMessages} from '../common/error-msgs';

@Component({
  selector: 'expected-account-detail',
  templateUrl: 'expected-account-detail.html'
})
export class ExpectedAccountDetailComponent implements OnInit {
  id: any;
  paramsSub: any;
  @Input() expectedAccount:ExpectedAccount;
  lang =  localStorage.getItem('localeId');
  public category=RegistrationCategory;
  
  orgNames:any[];
  rejectReason:string;
  orgName:any;
  form: FormGroup;
  errorMessages =ErrorMessages;
  successful:boolean;
  fail:boolean;
  businessConstraintFailure:boolean;
  smsFailure:boolean
  ministryNumber:number;
  disableApproveReject:boolean=false;
  constructor (private translate:TranslateService,private _registrationService:RegistrationService,private activatedRoute: ActivatedRoute,
                    public dialog: MdDialog,public viewContainerRef: ViewContainerRef,@Inject(FormBuilder) fb: FormBuilder){
 
        this.form = fb.group({
              rejectReason: [null,Validators.required],
              orgName: [null,Validators.required],
          });
          

  }



  ngOnInit() { 
            this.expectedAccount = new ExpectedAccount();
            this.paramsSub = this.activatedRoute.params.subscribe(params => {this.id = parseInt(params['id'], 10),
                                                                            this.ministryNumber = parseInt(params['ministry'], 10)});
            this.successful =false;
            this.fail= false;
             this.businessConstraintFailure =false;
             this.smsFailure=false;
            this._registrationService.getExpectedAccount(this.id).subscribe(
             data =>   {this.expectedAccount = data;

            if(this.expectedAccount.status ==3 || this.expectedAccount.status==2) { //Disbale Dropdown and Reject Reason hide buttons
            this.disableApproveReject=true;
            if(this.lang=='en') {
            this.form.patchValue({rejectReason: this.expectedAccount.englishRejectionReason})
          }
          else {
            this.form.patchValue({rejectReason: this.expectedAccount.shortRejectionReason})
          }
            this.form.controls['orgName'].disable();  
            this.form.controls['rejectReason'].disable();
           }
             this._registrationService.getEstablishmentInfoList(this.ministryNumber).subscribe(
             data =>   this.orgNames = data.establishmentInfoListList,
             error => console.log(error));},
             error => console.log(error));

  }

   ngOnDestroy() {
            this.paramsSub.unsubscribe();
  }

  reject(){
        this.successful =false;
        this.fail= false;
        this.form.get('rejectReason').setValidators(Validators.required);
        this.form.get('rejectReason').updateValueAndValidity();

        this.orgName = this.form.get('orgName').value ;
        this.rejectReason =this.form.get('rejectReason').value ;
        if(this.orgName == null ||this.rejectReason == null){

            return;
        }

        this._registrationService.acceptOrRejectTheRegistration(this.id,this.orgName,3,this.rejectReason).subscribe(
              data =>  this.processResponse(data),
              error => console.log(error));
  }
  accept(){
            this.successful =false;
            this.fail= false;

           this.orgName = this.form.get('orgName').value ;
           this.rejectReason =this.form.get('rejectReason').value ;
            
            if(this.orgName == null){
              return;
            }

           this._registrationService.acceptOrRejectTheRegistration(this.id,this.orgName.businessName,2,"").subscribe(
              data => this.processResponse(data)  ,
              error => {console.log(error);this.fail=true;});

  }

  processResponse(data){

      if (  data.code!=undefined && data.code == 0  && data.message== 'failed'){
         this.fail=true;
      }else if(data.code!=undefined && data.code == 0 && data.message== 'business_constraint_failure'){
         this.businessConstraintFailure=true;     

      } else if(data.code!=undefined && data.code == 0 && data.message== 'sms_failure'){
         this.smsFailure=true;     

      } 
      else if(data.code!=undefined && data.code == 1) { 
        this.successful =true;
      }
   }

/**
 * Open th dialog of selected registration 
 * @param registration 
 */
  openDetailDialog(registration:ExpectedAccountRegistration){

      let dialogRef = this.dialog.open(DetailDialog, {
         position:{top:'30px',left:'90px'},
          data:registration
      });
      dialogRef.afterClosed().subscribe(result => {

        dialogRef = null;
      });
  }

}


/**
 * DIALOG CLASS
 * open in case of selection from the approval page for company registration.
 * 
 */
import { NgForm,FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import {ExpectedAccountRegistration,RegistrationCategory } from './common'
import {DialogsService} from '../dialog/dialogs.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'detail-dialog',
  templateUrl: 'expected-account-detail-dialog.html'
})

export class DetailDialog {
  months:number;
  public form: FormGroup;
  public result: any;
  public category=RegistrationCategory;
 
  constructor(@Inject(MD_DIALOG_DATA) public data:ExpectedAccountRegistration ,private fb: FormBuilder,
                   public dialogRef:MdDialogRef<DetailDialog>,private dialogsService: DialogsService,
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

  /**
   * Call the service to get the file loaded against the registration
   */
  public getTheFile(){
    //accountId, registrationId,attachmentId
    this._registrationService.getExpectedRegistrationFile("1",this.data.registrationId,this.data.attachmentId).subscribe(res => {
        var blob = new Blob([res], { type: 'application/pdf' });
        //var url= window.URL.createObjectURL(blob);
        //window.open(url);
        FileSaver.saveAs(blob, "registration.pdf");    
      })
  }



  public openDialog() {    
      this.dialogsService
        .confirm('Confirm Dialog', 'Are you sure you want to do this?')
        .subscribe(res => this.result = res);
    }

}