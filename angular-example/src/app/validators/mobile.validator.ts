import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, FormControl, ValidatorFn, Validator } from '@angular/forms';


// validation function
function validateMobileFactory() : ValidatorFn {
  return (c: AbstractControl) => {
    
    let MOBILE_REGEXP = /^(9335)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;

    let isValid = MOBILE_REGEXP.test(c.value);
    
    if(isValid) {
      return null;
    } else {
      return {
        validateMobile: {
          valid: false
        }
      };
    }

  }
}


@Directive({
  selector: '[validateMobile][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MobileValidatorDirective, multi: true }
  ]
})
export class MobileValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validateMobileFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }
  
}
