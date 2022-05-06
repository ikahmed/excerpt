import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, FormControl, ValidatorFn, Validator } from '@angular/forms';


// validation function
function validateNumberFactory() : ValidatorFn {
  return (c: AbstractControl) => {
    
    let isValid = c.value > 0 || c.value == "";
    
    if(isValid) {
      return null;
    } else {
      return {
        validateNumber: {
          valid: false
        }
      };
    }

  }
}


@Directive({
  selector: '[validateNumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NumberValidatorDirective, multi: true }
  ]
})
export class NumberValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validateNumberFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }
  
}
