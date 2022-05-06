package com.ikhlaq.backend.enums;

public enum Role { 
	SYSTEM_ADMIN(1, "Sys_Adm", "Sys_Adm"), COMPANY_ADMIN(2, "Company_Adm", "Org_Adm"), BRANCH_ADMIN(
			3, "Br_Adm", "Br_Adm");

	private int code;
	private String shortDesc;
	private String englishDesc;

	private Role(int code, String shortDesc,
			String englishDesc) {
		this.code = code;
		this.shortDesc = shortDesc;
		this.englishDesc = englishDesc;
	}

	public int getCode() {
		return this.code;
	}

	public static Role getValue(int code) {
		Role value = null;
		Role[] values = Role.values();
		for (int i = 0; i < values.length; i++) {
			if (values[i].getCode() == code)
				value = values[i];
		}
		return value;
	}

	public static String getShortDesc(int code) {
		return getValue(code)==null ? "UNKOWN" :  getValue(code).shortDesc;
	}
	
	public static String getEnglishDesc(int code) {
		return getValue(code)==null ? "UNKOWN" :  getValue(code).englishDesc;
	}
}
