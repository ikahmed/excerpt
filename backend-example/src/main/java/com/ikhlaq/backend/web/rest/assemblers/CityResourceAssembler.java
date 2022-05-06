package com.ikhlaq.backend.web.rest.assemblers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.ikhlaq.backend.web.rest.resources.CityResource;

@Component
public class CityResourceAssembler{

    public CityResourceAssembler() {

    }


    public List<CityResource> toResources(Iterable<? extends City> cities) {
	List<CityResource> personResource = new ArrayList<>();

	for (City person : cities) {

	    personResource.add(toResource(person));
	}

	return personResource;
    }


    public CityResource toResource(City city) {
	CityResource cityResource = new CityResource();
	cityResource.setCityId(city.getCityId());
	cityResource.setRegionId(city.getRegion().getRegionId());
	cityResource.setShortName(city.getShortName());
	cityResource.setEnglishName(city.getEnglishName());

	return cityResource;
    }

}