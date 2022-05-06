package com.ikhlaq.backend.web.rest.resources;


public class CityResource {

    private int cityId;
    private int regionId;
    private String shortName;
    private String englishName;

    public int getCityId() {
	return cityId;
    }

    public void setCityId(int cityId) {
	this.cityId = cityId;
    }

    public int getRegionId() {
	return regionId;
    }

    public void setRegionId(int regionId) {
	this.regionId = regionId;
    }

    public String getShortName() {
	return shortName;
    }

    public void setShortName(String shortName) {
	this.shortName = shortName;
    }

    public String getEnglishName() {
	return englishName;
    }

    public void setEnglishName(String englishName) {
	this.englishName = englishName;
    }

}
