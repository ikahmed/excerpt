import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, FormControl, ValidatorFn, Validator } from '@angular/forms';


// validation function
function validateEmailFactory() : ValidatorFn {
  return (c: AbstractControl) => {
    
    //from http://emailregex.com/
    let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let isValid = EMAIL_REGEXP.test(c.value);
    
    if(isValid) {
      return null;
    } else {
      return {
        validateEmail: {
          valid: false
        }
      };
    }

  }
}


@Directive({
  selector: '[validateEmail][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }
  ]
})
export class EmailValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validateEmailFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }
  
}
