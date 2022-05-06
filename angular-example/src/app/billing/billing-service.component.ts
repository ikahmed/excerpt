import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions, Response } from '@angular/http';

import { AccountDetails } from '../common/account-info';
import { BillingInvoice } from '../common/billing-invoice';
import { PriceListDetails } from '../common/price-list';
import { PurchagePoints } from '../common/purchase';
import { Result } from '../common/result';

@Injectable()
export class BillingManageService {
        private proxyUrl = environment.proxyUrl;
        private deployFolder = environment.deployFolder;
        private prefixURL= environment.deployFolder + environment.proxyUrl;
        private getPriceListUrl:string;
        private rechargePointsUrl:string;
        private getBillingInvoicesListUrl:string;
        private getConsumeRateUrl:string;
        private getCompanyDetailsUrl:string;
        constructor(private http:Http){
          this.getPriceListUrl = this.prefixURL + '/billing/price-list';
          this.rechargePointsUrl = this.prefixURL + '/billing/recharge';
          this.getBillingInvoicesListUrl = this.prefixURL + '/billing/invoice-list';
          this.getConsumeRateUrl = this.prefixURL + '/billing/consumer-rate';
          this.getCompanyDetailsUrl=this.prefixURL + '/billing/company-account';
        }
    
     public getPriceListDetailsList():Observable<PriceListDetails[]>{
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });


      return this.http.get(this.getPriceListUrl, options)
                      .map(x => x.json())
                      .catch(this.handleError);
      }
    
    private handleError (error: Response | any) {
      let errMsg: string;
      if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = body;
      } else {
        errMsg = error.message ? error.message : error.toString();
      }

      return Observable.throw(errMsg);
    } 

    savePurchagePoints( request: PurchagePoints): Observable<BillingInvoice> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.savRechargePointsUrl,request,options)
                        .map(x => x.json())
                        .catch(this.handleError);
    }

     public getBillingInvoicesList():Observable<BillingInvoice[]>{
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });


      return this.http.get(this.getBillingInvoicesListUrl, options)
                      .map(x => x.json())
                      .catch(this.handleError);
      }

      public getConsumeRate():Observable<number>{
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.getConsumeRateUrl, options)
                      .map(x => x.json())
                      .catch(this.handleError);
      }

      getCompanyDetails():Observable<AccountDetails>{
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.getCompanyDetailsUrl, options)
                      .map(x => x.json())
                      .catch(this.handleError);
      }

}