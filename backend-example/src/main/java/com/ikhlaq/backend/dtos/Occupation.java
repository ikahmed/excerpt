package com.ikhlaq.backend.dtos;

public class Occupation {
    
	private String code;
	private String shortDesc;
	private String englishDesc;
	
	
	
	public Occupation(String code, String shortDesc, String englishDesc) {
		super();
		this.code = code;
		this.shortDesc = shortDesc;
		this.englishDesc = englishDesc;
	}
	
	
	public Occupation(String code, String shortDesc) {
		super();
		this.code = code;
		this.shortDesc = shortDesc;
	}
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getShortDesc() {
		return shortDesc;
	}
	public void setShortDesc(String shortDesc) {
		this.shortDesc = shortDesc;
	}
	public String getEnglishDesc() {
		return englishDesc;
	}
	public void setEnglishDesc(String englishDesc) {
		this.englishDesc = englishDesc;
	}

	
	
	
}
