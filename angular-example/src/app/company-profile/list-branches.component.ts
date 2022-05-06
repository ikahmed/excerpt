import { TranslateService } from 'ng2-translate';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { DataSource } from '@angular/cdk';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MdPaginator, MdSort } from '@angular/material';

import { RegistrationService } from '../registration/registration.service';
import { OrgAccount } from './common';

@Component({
  selector: 'branches-list',
  templateUrl: 'branches-list.html',
  styleUrls:['company.profile.css']
})
export class BranchesListComponent implements OnInit {
       @ViewChild('filter') filter: ElementRef;
       @ViewChild(MdSort) sort: MdSort;
       @ViewChild(MdPaginator) paginator: MdPaginator;
       branches:OrgAccount[];
       branchDetailURL="/branch-details";
       lang = localStorage.getItem('localeId');
      constructor (private translate:TranslateService,private registrationService: RegistrationService){
      }
      database = new Database(this.registrationService);
      dataSource: ListUsersAccountDataSource | null;
      displayedColumns = ['ministryNumber','branchName', 'city', 'creationDate', 'phoneNumber','view'];
     ngOnInit():void {
        this.dataSource = new ListUsersAccountDataSource(this.database,this.sort,this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    }    

}

export class Database {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<OrgAccount[]> = new BehaviorSubject<OrgAccount[]>([]);
  get data(): OrgAccount[] { return this.dataChange.value; }
  expectedAccounts: OrgAccount[];
  constructor(private _registrationService: RegistrationService) {
    _registrationService.getAccountBranches().subscribe(
      data => this.dataChange.next(data),
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

  connect(): Observable<OrgAccount[]> {
     const displayDataChanges = [
      this._database.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return this.getSortedData().splice(startIndex, this._paginator.pageSize).filter((item: OrgAccount) => {
        let searchStr:any;
        if (this.lang == 'ar'){
            searchStr = (item.ministryNumber + item.shortName + item.cityShortDesc + item.creationDate).toLowerCase();
        }else{
            searchStr = (item.ministryNumber + item.englishName + item.cityEnglishDesc + item.creationDate).toLowerCase();
        }
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });;
    });
  }
  disconnect() {}

  getSortedData(): OrgAccount[] {
    const data = this._database.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    
    
    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'username': [propertyA, propertyB] = [a.englishName, b.englishName]; break;
        case 'idNumber': [propertyA, propertyB] = [a.ministryNumber, b.ministryNumber]; break;
        case 'shortFullName': [propertyA, propertyB] = [a.englishShortName, b.englishShortName]; break;
        case 'mobile': [propertyA, propertyB] = [a.phoneNumber, b.phoneNumber]; break;
        case 'action': [propertyA, propertyB] = [a.status, b.status]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });

  }

}
