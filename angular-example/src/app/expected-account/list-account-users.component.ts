import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import { RegistrationService } from '../registration/registration.service';
import { ExpectedAccount } from './common';
import { UserProfileService } from '../user-profile/user-profile.service';
import {TranslateService} from 'ng2-translate';
import {DataSource} from '@angular/cdk';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator}  from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { User,Gender } from '../common/user';
import {MdSort} from '@angular/material';
import { Router } from '@angular/router';
import {DialogsService} from '../dialog/dialogs.service';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA,MdDialogConfig} from '@angular/material';

@Component({
  selector: 'list-account-users',
  templateUrl: 'list-account-users.html',
  styleUrls: ['list-account-users.css']
 
})
export class ListAccountUsersComponent implements OnInit{

       @ViewChild('filter') filter: ElementRef;
       @ViewChild(MdSort) sort: MdSort;
        @ViewChild(MdPaginator) paginator: MdPaginator;
       refreshURL="/list-account-users";
       usrStatusUpdateSuccess = false;
       usrStatusUpdateFail = false;
       userDetailURL="/user-profile";
       addUserURL="/add-new-user";
       public result: any;
       showAddUser = true;
       lang: string = localStorage.getItem("localeId");
       constructor (private translate:TranslateService,private userProfileService:UserProfileService,private router: Router,
        private dialogsService: DialogsService,public dialog: MdDialog){
      }
      displayedColumns = ['username','idNumber', 'mobile', 'action','view'];
      database = new Database(this.userProfileService);
      dataSource: ListUsersAccountDataSource | null;

    ngOnInit():void {

        this.dataSource = new ListUsersAccountDataSource(this.database,this.sort,this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
          this.dataSource.filter = this.filter.nativeElement.value;
        });

    this.userProfileService.getAccountUsersCount().subscribe( 
     data => this.showAddUser = data,
     error => console.log(error));
    }

    public openDetailDialog(user:User) {
      let dialogRef = this.dialog.open(ConfirmDetailDialog, {
          height: '250px',
          width: '400px',
          hasBackdrop: true,
          position:{top:'150px',left:'250px'}
     });
      dialogRef.afterClosed().subscribe(result => {
         if(result){
            this.updateUserStatus(user);
          Observable.timer(1000).first().subscribe(() => this.refreshData());
          // this.refreshData();
            return this.router.navigateByUrl(this.refreshURL);
         }
         dialogRef = null;
    });
       return this.router.navigateByUrl(this.refreshURL);
    }

    private refreshData(): void {
        this.database = new Database(this.userProfileService);
        this.database.dataChange;
        this.dataSource = new ListUsersAccountDataSource(this.database,this.sort,this.paginator);
        
    }

    updateUserStatus(user:User){
      this.userProfileService.updateUserStatus(user.username).subscribe(
      data => {
        this.database.dataChange;
        if(data.message == "success"){
         this.usrStatusUpdateSuccess = true;

        }
        else if(data.message == "error"){
            this.usrStatusUpdateFail = true;
        }
      },
      error => {
        if(error.message == "error"){
          this.usrStatusUpdateFail = true;
        }
    });
      
      
    }
     
   }

export class Database {
  /** Stream that emits whenever the data has been modified. */
dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  get data(): User[] { return this.dataChange.value; }
  users:User[];
  constructor(private _userProfileService:UserProfileService) {
              _userProfileService.getusers().subscribe(
              data =>   this.dataChange.next(data),
              error => console.log(error));
     }
  }

export class ListUsersAccountDataSource extends DataSource<any> {
   _filterChange = new BehaviorSubject('');
    lang =  localStorage.getItem('localeId');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }
   constructor(private _database: Database,private _sort: MdSort,private _paginator: MdPaginator) {    
    super();    
   }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
     const displayDataChanges = [
      this._database.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return this.getSortedData().splice(startIndex, this._paginator.pageSize).filter((item: User) => {
        let searchStr:any;
        if (this.lang == 'ar'){
            searchStr = (item.username + item.idNumber + item.shortFullName + item.mobile).toLowerCase();
        }else{
            searchStr = (item.username + item.idNumber + item.englishFullName + item.mobile).toLowerCase();
        }
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });;
    });
  }
  disconnect() {}

  getSortedData(): User[] {
    const data = this._database.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    
    
    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'username': [propertyA, propertyB] = [a.username, b.username]; break;
        case 'idNumber': [propertyA, propertyB] = [a.idNumber, b.idNumber]; break;
        case 'shortFullName': [propertyA, propertyB] = [a.shortFullName, b.shortFullName]; break;
        case 'mobile': [propertyA, propertyB] = [a.mobile, b.mobile]; break;
        case 'action': [propertyA, propertyB] = [a.status, b.status]; break;
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
  styleUrls:['confirm.dailog.css']
})
export class ConfirmDetailDialog {
  constructor(
    public dialogRef:MdDialogRef<ConfirmDetailDialog>,private dialogsService: DialogsService)  { }
    public result: any;

    public ngOnInit() {

 }

}
