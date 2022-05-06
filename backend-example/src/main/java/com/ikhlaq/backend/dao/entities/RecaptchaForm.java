package com.ikhlaq.backend.dao.entities;

import org.hibernate.validator.constraints.NotEmpty;

public abstract class RecaptchaForm {

    @NotEmpty
    private String recaptchaResponse;

    public void setRecaptchaResponse(String response) {
        this.recaptchaResponse = response;
    }

    public String getRecaptchaResponse() {
        return recaptchaResponse;
    }

    @Override
    public String toString() {
        return "RecaptchaForm{" +
                "recaptchaResponse='" + recaptchaResponse + '\'' +
                '}';
    }
}
