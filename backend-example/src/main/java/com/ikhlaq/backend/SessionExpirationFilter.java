package com.ikhlaq.backend;
import org.springframework.beans.factory.InitializingBean;

import org.springframework.util.Assert;

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

public class SessionExpirationFilter implements Filter, InitializingBean{


    private String expiredUrl="/expired?expired";


    public void afterPropertiesSet() throws Exception {
        Assert.hasText(expiredUrl, "ExpiredUrl required");
    }
    

    public void destroy() {}

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
        Assert.isInstanceOf(HttpServletRequest.class, request, "Can only process HttpServletRequest");
        Assert.isInstanceOf(HttpServletResponse.class, response, "Can only process HttpServletResponse");

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        HttpSession session = httpRequest.getSession(false);

        if (session == null &&
            httpRequest.getRequestedSessionId() == null &&
            !httpRequest.isRequestedSessionIdValid())
        {    
            String targetUrl = httpRequest.getContextPath() + expiredUrl;
            request.setAttribute("expired", "expired");
            chain.doFilter(request, response);
        }
        request.setAttribute("expired", "expired");
        chain.doFilter(request, response);
    }

    public void init(FilterConfig arg0) throws ServletException {}

    public void setExpiredUrl(String expiredUrl) {
        this.expiredUrl = expiredUrl;
    }

}
