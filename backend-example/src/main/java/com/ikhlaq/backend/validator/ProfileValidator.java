package com.ikhlaq.backend.validator;

import java.math.BigDecimal;

import com.ikhlaq.backend.dao.entities.User;
import com.ikhlaq.backend.dtos.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class ProfileValidator {
	
	public static boolean validateUserProfile(User user, ProfileResource userdto) {
		boolean valid = false;
		if(userdto!=null && user.getMobileNo() != new BigDecimal(userdto.getMobile()) && validateMobileNo(userdto.getMobile()+"")){
			valid = true;
		}
		else if(userdto!=null && !user.getEmail().equalsIgnoreCase(userdto.getEmail()) && validateEmail(userdto.getEmail())) {
			valid = true;
		}
		return valid;
	}
	
	public static boolean validateUserProfile(User user, UserDTO userdto) {
		boolean validUserPrifle = false;
		if(userdto!=null && user.getMobileNo() != new BigDecimal(userdto.getMobile()) && validateMobileNo(userdto.getMobile()+"")){
			validUserPrifle = true;
		}
		else if(userdto!=null && !user.getEmail().equalsIgnoreCase(userdto.getEmail()) && validateEmail(userdto.getEmail())) {
			validUserPrifle = true;
		}
		return validUserPrifle;
	}
	
	private static boolean validateMobileNo(String mobileNo){
		boolean validMobNo = false;
		String regEx ="(\\+91-?|0)?\\d{9,12}";
		if(mobileNo.matches(regEx)) {
			validMobNo = true;
		}
		
		return validMobNo;
	}
	
	private static boolean validateEmail(String email){
		boolean validEmail = false;
		String regEx ="^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$";
		if(email.matches(regEx)) {
			validEmail = true;
		}
		
		return validEmail;
	}


}
