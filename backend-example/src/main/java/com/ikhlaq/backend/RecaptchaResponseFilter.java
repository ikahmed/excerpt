package com.ikhlaq.backend;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ikhlaq.backend.utils.LogUtils;


@Component
public class RecaptchaResponseFilter extends UsernamePasswordAuthenticationFilter {

    private static final String RECAPTCHA_RESPONSE_ALIAS = "recaptchaResponse";
    private static final String RECAPTCHA_RESPONSE_ORIGINAL = "g-recaptcha-response";

    private static class ModifiedHttpServerRequest extends HttpServletRequestWrapper {

        final Map<String, String[]> parameters;
        
        @Value("${be.captcha.enabled}")
    	private String captchaEnable;

        public ModifiedHttpServerRequest(HttpServletRequest request) {
            super(request);
            parameters = new HashMap<>(request.getParameterMap());
            parameters.put(RECAPTCHA_RESPONSE_ALIAS, request.getParameterValues(RECAPTCHA_RESPONSE_ORIGINAL));
        }

        @Override
        public String getParameter(String name) {
            return parameters.containsKey(name) ? parameters.get(name)[0] : null;
        }

        @Override
        public Map<String, String[]> getParameterMap() {
            return parameters;
        }

        @Override
        public Enumeration<String> getParameterNames() {
            return Collections.enumeration(parameters.keySet());
        }

        @Override
        public String[] getParameterValues(String name) {
            return parameters.get(name);
        }
    }

/*  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
	  
  }*/

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if (servletRequest instanceof HttpServletRequest && servletRequest.getParameter(RECAPTCHA_RESPONSE_ORIGINAL) != null) {
        	filterChain.doFilter(new ModifiedHttpServerRequest((HttpServletRequest) servletRequest), servletResponse);
        	
        } 
        else {
            filterChain.doFilter(servletRequest, servletResponse);
        }
        
        
        
    }

    @Override
    public void destroy() {
    }

}