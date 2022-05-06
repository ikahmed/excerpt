package com.ikhlaq.backend.dtos;

public class RechargePoints {
	
    private int pricelistId;
    private float 	amount;
    private int pointscount;
  
	public int getPricelistId() {
		return pricelistId;
	}
	public void setPricelistId(int pricelistId) {
		this.pricelistId = pricelistId;
	}
	public float getAmount() {
		return amount;
	}
	public void setAmount(float amount) {
		this.amount = amount;
	}
	public int getPointscount() {
		return pointscount;
	}
	public void setPointscount(int pointscount) {
		this.pointscount = pointscount;
	}


}
