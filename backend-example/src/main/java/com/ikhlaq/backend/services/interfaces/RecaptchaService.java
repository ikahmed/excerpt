package com.ikhlaq.backend.services.interfaces;

public interface RecaptchaService {

    boolean isResponseValid(String remoteIp, String response);

}
