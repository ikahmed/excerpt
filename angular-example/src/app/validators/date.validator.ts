import { Component, Input, OnInit, AfterViewChecked, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration/registration.service';
import { ErrorMessages } from '../common/error-msgs'
import { Company } from '../common/company'

export class ValidateDate {
    constructor(private registrationService: RegistrationService) { }
    today: String;
    ngOnInit(): void {
        this.registrationService.getTodayDate().subscribe(
            data => this.today = data,
            error => console.log(error)
        );
    }


    public checkDate(form: any, field: any, issueDate: any, expiryDate: any) {
        if (this.today != undefined) {

            var todayNumeric = this.today.split("-").join("");

            if (issueDate != undefined && issueDate != "") {
                var issue: string = issueDate[0].formatDate("yyyy-mm-dd");
                var issueNumeric = issue.split("-").join("");

                if (issueNumeric > todayNumeric) {
                    form.formErrors.issueDate = "ERROR.formatNotValid";
                    field.issueDate = "";
                }
            }
            if (expiryDate != undefined && expiryDate != "") {
                var expiry: string = expiryDate[0].formatDate("yyyy-mm-dd");
                var expiryNumeric = expiry.split("-").join("");

                if (expiryNumeric < todayNumeric || issueNumeric > expiryNumeric) {
                    form.formErrors.expiryDate = "ERROR.formatNotValid";
                    field.expiryDate = "";

                }
            }
        }

    }

}