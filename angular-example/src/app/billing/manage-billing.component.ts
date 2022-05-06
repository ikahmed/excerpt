import { Component, AfterViewChecked, OnInit,ViewChild,Input,Output,EventEmitter,ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PriceListDetails } from '../common/pricelistdetails';
import { PurchagePoints } from '../common/purchagepoints';
import { ErrorMessages } from '../common/error-msgs';
import {BillingManageService} from './billing-service.component';
import {UserProfileService} from '../user-profile/user-profile.service'; 
import { Router } from '@angular/router';
import { BillingInvoice } from '../common/billing-invoice';
import {TranslateService} from 'ng2-translate';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator}  from '@angular/material';
import {MdSort} from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {DialogsService} from '../dialog/dialogs.service';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA,MdDialogConfig} from '@angular/material';
import { AccountDetails } from '../common/accountdetails';
import { ILookup } from '../registration/registration-common'
import { RegistrationService } from '../registration/registration.service';
@Component({
  selector: 'manage-billing',
  templateUrl: './manage-billing.html',
  styleUrls: ['./manage.billing.css']
})
export class BillingManagementComponent implements AfterViewChecked ,OnInit{

@Input() pricelistdetails: PriceListDetails[];
@Input() purchagePoints:PurchagePoints; 
@Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
@Input() accountDetails:AccountDetails;

submitted = false;
lang: string = localStorage.getItem("localeId"); // language
@ViewChild('filter') filter: ElementRef;
@ViewChild(MdSort) sort: MdSort;
@ViewChild(MdPaginator) paginator: MdPaginator;
paymentSuccess = false;
paymentFail=false;
currentUsersCount:any;
nofoBlancePoints:any;
billingResult: BillingInvoice;
 
constructor(private billingManageService: BillingManageService,private userProfileService:UserProfileService,private router: Router,
  private dialogsService: DialogsService,public dialog: MdDialog) { }
  displayedColumns = ['paymentStatus', 'billingNumber','pointsCount', 'cost','paymentDate','creationDate'];
  database = new Database(this.billingManageService);
  dataSource: ListBillingInvoicesDataSource | null;

onSubmit(){
   this.submitted = true;
   this.openConfromDialog();
}

private refreshData(): void {
        this.database = new Database(this.billingManageService);
        this.database.dataChange;
        this.dataSource = new ListBillingInvoicesDataSource(this.database,this.sort,this.paginator);
}

   savePurchagePoints() {

      this.billingManageService.savePurchagePoints(this.purchagePoints).subscribe(
      data => { this.billingResult = data

        if(this.billingResult.resultCode == 1){ //Success
          this.paymentSuccess = true;
          this.rechargePointsForm.reset();
          Observable.timer(50).first().subscribe(() => this.refreshData());
          
        }
        else if(this.billingResult.resultCode == 0){ //Failed or Error occured
             Observable.timer(50).first().subscribe(() => this.refreshData());
            this.paymentFail = true;
        }
      },
      error => {

        if(error.message == "error"){
          this.paymentFail = true;
          this.rechargePointsForm.invalid;
          this.notify.emit(this.rechargePointsForm.invalid);
        }
    });
      
     
      return this.router.navigate(["/manage-billing"]);
   }

ngOnInit() {
    this.purchagePoints = new PurchagePoints(null, null,null);
    this.accountDetails = new AccountDetails(null, null,null,null, null,null,null,null, null,null,null);
    this.billingResult  = new BillingInvoice(null, null,null,null, null,null,null,null, null,null,null,null,null,null);
    this.billingManageService.getPriceListDetailsList().subscribe(x => {
              this.pricelistdetails = [].concat(x); }, err => {
  
  });
  this.dataSource = new ListBillingInvoicesDataSource(this.database,this.sort,this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
          this.dataSource.filter = this.filter.nativeElement.value;
  });

   this.userProfileService.getCurrentUsersCount().subscribe(x => {
              this.currentUsersCount = [].concat(x); }, err => {
   });

   this.userProfileService.getCurrentBalancePoints().subscribe(x => {
              this.nofoBlancePoints = [].concat(x); }, err => {
   });
   
     this.billingManageService.getCompanyDetails().subscribe(
                     data => this.accountDetails = data,
                     error => console.log(error));
                  
}

pupulateCost(pointscount){
    for(let result of this.pricelistdetails){
        if(result.sliceStartVolume == pointscount) {

             this.purchagePoints.amount = result.cost;
             this.purchagePoints.pricelistId = result.pricelistID;   
            break;
         }
    }
       
}

  rechargePointsForm: NgForm;
  @ViewChild('rechargePointsForm') currentForm: NgForm;

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.rechargePointsForm) { return; }
    this.rechargePointsForm = this.currentForm;
    if (this.rechargePointsForm) {
      this.rechargePointsForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

   onValueChanged(data?: any) {

    if (!this.rechargePointsForm) { return; }
    //this.checkUserExistance()
    const form = this.rechargePointsForm.form;
    var messages = null;
    if (this.lang == 'en') {
       messages = ErrorMessages.validationMessagesEn;
    } else {
       messages = ErrorMessages.validationMessagesAr;
    }

    for (const field in this.formErrors) {

      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
    this.notify.emit(form.valid);
  } 

  formErrors = {
    'pricelistId': '',
    'amount':''
  };

  public openConfromDialog() {
      let dialogRef = this.dialog.open(ConfirmRechargePointDialog, {
          height: '300px',
          width: '400px',
          hasBackdrop: true,
          position:{top:'150px',left:'250px'}
     });
      dialogRef.afterClosed().subscribe(result => {
         if(result){
            this.savePurchagePoints();
         }
         else {
            this.notify.emit(this.rechargePointsForm.valid &&  !this.rechargePointsForm.dirty);
         }
         dialogRef = null;
    });
       return true;
    }
  


}

export class Database {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<BillingInvoice[]> = new BehaviorSubject<BillingInvoice[]>([]);
  get data(): BillingInvoice[] { return this.dataChange.value; }
  billinginvoice:BillingInvoice[];
  constructor(private _billingManageService:BillingManageService) {
              _billingManageService.getBillingInvoicesList().subscribe(
              data =>   this.dataChange.next(data),
              error => console.log(error));
     }
  }

export class ListBillingInvoicesDataSource extends DataSource<any> {
   _filterChange = new BehaviorSubject('');
    lang =  localStorage.getItem('localeId');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }
   constructor(private _database: Database,private _sort: MdSort,private _paginator: MdPaginator) {    
    super();    
   }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<BillingInvoice[]> {
     const displayDataChanges = [
      this._database.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
       const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      //(startIndex, this._paginator.pageSize);
      return this.getSortedData().splice(startIndex, this._paginator.pageSize).filter((item: BillingInvoice) => {
        let searchStr:any;
        if(item.invoiceNumber == null){
           item.invoiceNumber="";
        }
        if(item.cost == null){
           item.cost =0;
        }
        if(item.pointsCount == null){
           item.pointsCount =0;
        }
        if(item.paymentStatus == null){
           item.paymentStatus.englishDesc="";
        }
        if(item.billingNumber == null){
           item.billingNumber ="";
        }
        if(item.creationDate == null){
           item.creationDate ="";
        }
        if (this.lang == 'ar'){
            searchStr = (item.invoiceNumber+ item.cost +item.pointsCount+ item.paymentStatus+ item.billingNumber+ item.creationDate).toLowerCase();
        }else{
            searchStr = (item.invoiceNumber+ item.cost +item.pointsCount+ item.paymentStatus+ item.billingNumber+ item.creationDate).toLowerCase();
        }
        
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }
  disconnect() {}

  getSortedData(): BillingInvoice[] {
    const data = this._database.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    
    
    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';
      switch (this._sort.active) {
        case 'invoiceNumber': [propertyA, propertyB] = [a.invoiceNumber, b.invoiceNumber]; break;
        case 'pointsCount': [propertyA, propertyB] = [a.pointsCount, b.pointsCount]; break;
        case 'paymentStatus': [propertyA, propertyB] = [a.paymentStatus.englishDesc, b.paymentStatus.englishDesc]; break;
        case 'cost': [propertyA, propertyB] = [a.cost, b.cost]; break;
        case 'billingNumber': [propertyA, propertyB] = [a.billingNumber, b.billingNumber]; break;
        case 'paymentDate': [propertyA, propertyB] = [a.paymentDate, b.paymentDate]; break;
        case 'creationDate': [propertyA, propertyB] = [a.creationDate, b.creationDate]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });

  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm.dailog.html',
  styleUrls:['manage.billing.css']
})
export class ConfirmRechargePointDialog {
  constructor(
    public dialogRef:MdDialogRef<ConfirmRechargePointDialog>,private dialogsService: DialogsService)  { }
    public result: any;

    public ngOnInit() {
    }
 }
