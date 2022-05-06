package com.ikhlaq.backend.dtos;


public class Request {


	private String category;
	private String action;
	private String type;//transaction or exception
	private String time;	
	
	
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	
	@Override
	public String toString() {
		return "Request [category=" + category + ", action=" + action
				+ ", type=" + type + ", time=" + time + "]";
	}


}
