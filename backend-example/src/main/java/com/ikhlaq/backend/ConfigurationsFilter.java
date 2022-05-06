package com.ikhlaq.backend;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.http.HttpRequest;
import org.springframework.web.filter.OncePerRequestFilter;

public class ConfigurationsFilter  implements Filter {

@Override
public void init(FilterConfig filterConfig) throws ServletException {
	// TODO Auto-generated method stub
	
}

@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
		throws IOException, ServletException {

    HttpServletRequest httprequest = (HttpServletRequest) request;
    HttpSession  session = httprequest.getSession();
    String lang = httprequest.getLocale().getLanguage();
    session.setAttribute("lang", lang);
    httprequest.setAttribute("lang", lang);
    chain.doFilter(request, response);
}

@Override
public void destroy() {
	// TODO Auto-generated method stub
	
}



}
