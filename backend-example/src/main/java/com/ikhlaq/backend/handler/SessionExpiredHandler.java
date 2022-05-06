package com.ikhlaq.backend.handler;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.web.session.SessionInformationExpiredEvent;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;

public class SessionExpiredHandler implements SessionInformationExpiredStrategy{
	
	private final String expiredUrl;

	public SessionExpiredHandler(String expiredUrl) {
		this.expiredUrl = expiredUrl;
	}
	
	@Override
    public void onExpiredSessionDetected(SessionInformationExpiredEvent sessionInformationExpiredEvent) throws IOException, ServletException {
        HttpServletRequest request = sessionInformationExpiredEvent.getRequest();
        HttpServletResponse response = sessionInformationExpiredEvent.getResponse();
        request.getSession();
        response.sendRedirect(request.getContextPath() + expiredUrl);
    } 

}
