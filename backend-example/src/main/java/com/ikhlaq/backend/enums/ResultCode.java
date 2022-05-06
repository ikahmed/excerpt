package com.ikhlaq.backend.enums;

public enum ResultCode {

	SUCCESS((short) 0, "Successful"),
	FAILED((short) 1, "Failed");
	
	private short code;
	private String message;
	
	ResultCode(short code, String message){
		this.code = code;
	}
	
	public short getCode(){
		return this.code;
	}
	
	public String getMessage(){
		return this.message;
	}
}
