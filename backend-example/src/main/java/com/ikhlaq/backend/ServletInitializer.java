package com.ikhlaq.backend;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(BEWeb.class);
	}

    @Configuration
    @ImportResource("classpath:/applicationContext.xml")
    protected static class XmlImportingConfiguration {
    }
	
    @EnableWebMvc
    @EnableAsync
    @Configuration
	protected static class ResourcesWebMvcConfiguration extends WebMvcConfigurerAdapter {
    	
    	private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
            "classpath:/META-INF/resources/", "classpath:/resources/",
            "classpath:/static/", "classpath:/public/" };
    	
	    @Override
	    public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    //    LOG.debug("Resource is being registered .....");
	        registry.addResourceHandler("/js/**").addResourceLocations("/js/");
	        registry.addResourceHandler("/css/**").addResourceLocations("/css/");
	        registry.addResourceHandler("/html/**").addResourceLocations("/html/");
	        registry.addResourceHandler("/fonts/**").addResourceLocations("/fonts/");
	        registry.addResourceHandler("/images/**").addResourceLocations("/images/");
	        registry.addResourceHandler("/images/**").addResourceLocations("/images/");
	       // registry.addResourceHandler("/management/**").addResourceLocations("/management/");
	        registry.addResourceHandler("/**").addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);
	    }


	}

}