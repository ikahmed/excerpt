import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RegistrationService } from '../registration/registration.service';
import { ExpectedAccount } from './common';
import { TranslateService } from 'ng2-translate';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MdPaginator, MdSort } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'list-expected-account',
  templateUrl: 'list-expected-accounts.html',
  styleUrls: ['list-expected-accounts.css']

})
export class ListExpectedAccountComponent implements OnInit {
  expectedAccounts: ExpectedAccount[];
  detailURL = "/expected-account-detail/";
  lang = localStorage.getItem('localeId');
  hasError:false;
  constructor(private translate: TranslateService, private registrationService: RegistrationService) {
  }

  displayedColumns = ['ministryNumber', 'orgName', 'city', 'legalEntityType', 'creationDate', 'userName', 'userMobileNumber', 'status', 'action'];

  database = new Database(this.registrationService);
  dataSource: ExpectedAccountDataSource | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;

  ngOnInit(): void {
    this.dataSource = new ExpectedAccountDataSource(this.database, this.sort,this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  // gotoDetail(): void {
  //   this.router.navigate(['/detail', '17']);
  // }
}

export class Database {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<ExpectedAccount[]> = new BehaviorSubject<ExpectedAccount[]>([]);
  get data(): ExpectedAccount[] { return this.dataChange.value; }
  expectedAccounts: ExpectedAccount[];
  constructor(private _registrationService: RegistrationService) {
    _registrationService.getAllExpectedAccount().subscribe(
      data => this.dataChange.next(data),
      error => console.log(error));
  }
}


export class ExpectedAccountDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  lang = localStorage.getItem('localeId');

  constructor(private _database: Database, private _sort: MdSort,private _paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ExpectedAccount[]> {
    // return this._database.dataChange;

    const displayDataChanges = [
      this._database.dataChange,
      this._filterChange,
      this._sort.mdSortChange,
      this._paginator.page,
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      let expectedAccounts =  this._database.data.splice(startIndex, this._paginator.pageSize).filter((item: ExpectedAccount) => {
        let searchStr: any;
        if (this.lang == 'en') {
          searchStr = (item.cityEnglishDesc + item.ministryNumber + item.companyTypeEnglishDesc + item.creationDate + item.statusEnglishDesc + item.userName).toLowerCase();
        } else {
          searchStr = (item.cityShortDesc + item.ministryNumber + item.companyTypeShortDesc + item.creationDate + item.statusShortDesc + item.userName).toLowerCase();
        }
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
      return this.getSortedData(expectedAccounts);
    });

  }

  disconnect() { }


  /** Returns a sorted copy of the database data. */
  getSortedData(data: ExpectedAccount[]): ExpectedAccount[] {

    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'ministryNumber': [propertyA, propertyB] = [a.ministryNumber, b.ministryNumber]; break;
        case 'orgName': if (this.lang == 'en') {
          [propertyA, propertyB] = [a.englishName, b.englishName];
        } else {
          [propertyA, propertyB] = [a.shortName, b.shortName];

        } break;
        case 'city': if (this.lang == 'en') {
          [propertyA, propertyB] = [a.cityEnglishDesc, b.cityEnglishDesc];

        } else {
          [propertyA, propertyB] = [a.cityShortDesc, b.cityShortDesc];

        } break;
        case 'legalEntityType': if (this.lang == 'en') {
          [propertyA, propertyB] = [a.companyTypeEnglishDesc, b.companyTypeEnglishDesc];

        } else {
          [propertyA, propertyB] = [a.companyTypeShortDesc, b.companyTypeShortDesc];

        } break;
        case 'status': if (this.lang == 'en') {
          [propertyA, propertyB] = [a.statusEnglishDesc, b.statusEnglishDesc];

        } else {
          [propertyA, propertyB] = [a.statusShortDesc, b.statusShortDesc];

        } break;
        case 'userName': [propertyA, propertyB] = [a.userName, b.userName]; break;
        case 'creationDate': [propertyA, propertyB] = [a.creationDate, b.creationDate]; break;

      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
