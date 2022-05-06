/**
 * 
 */
package com.ikhlaq.backend.validator;


public class ValidationUtil {

    public static boolean isEmpty(String... args) {
	for (String str : args) {
	    if (null == str || str.equals("")) {
		return true;
	    }
	}
	return false;

    }

/*    public static boolean isValidministryNumber(String number) {
	if (ministryNumberValidationUtil.isValidGovernmentministryNumber(number)) {
	    return false;
	}
	return true;
    }*/
}
